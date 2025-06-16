import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScrapperService } from 'src/services/scrapper/scrapper.service';
import { PhonemeEntity } from '../words/entities/phoneme.entity';
import {
  PronunciationEntity,
  PronunciationLocale,
} from '../words/entities/pronunciation.entity';
import { WordImageEntity } from '../words/entities/word-image.entity';
import { WordEntity } from '../words/entities/word.entity';
import { WordTypesEntity } from '../words/entities/word_types.entity';
import { CreateAdjectiveDto } from './dto/create-adjective.dto';
import { AdjectiveEntity } from './entities/adjective.entity';
import { UpdateAdjectiveDto } from './dto/update-adjective.dto';
import { AdjectiveResponseDto } from './dto/adjective-response.dto';

@Injectable()
export class AdjectivesService {
  constructor(
    @InjectRepository(AdjectiveEntity)
    private readonly adjectiveRepository: Repository<AdjectiveEntity>,
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
    @InjectRepository(WordTypesEntity)
    private readonly wordTypesRepository: Repository<WordTypesEntity>,
    @InjectRepository(WordImageEntity)
    private readonly wordImageRepository: Repository<WordImageEntity>,
    @InjectRepository(PronunciationEntity)
    private readonly pronunciationRepository: Repository<PronunciationEntity>,
    @InjectRepository(PhonemeEntity)
    private readonly phonemeRepository: Repository<PhonemeEntity>,
    private readonly scrapperService: ScrapperService,
  ) {}

  async create(createAdjectiveDto: CreateAdjectiveDto) {
    // 1. Scrapea información adicional
    const pronunciations = await this.scrapperService.scrapeWebsite(
      'https://dictionary.cambridge.org/pronunciation/english/',
      createAdjectiveDto,
    );

    // 2. Busca o crea el tipo "adjective"
    let type = await this.wordTypesRepository.findOne({
      where: { name: 'adjective' },
    });
    if (!type) {
      type = this.wordTypesRepository.create({ name: 'adjective' });
      await this.wordTypesRepository.save(type);
    }

    // 3. Crear y guardar la palabra con el tipo
    const word = this.wordRepository.create({
      name: createAdjectiveDto.wordName,
      type,
    });
    await this.wordRepository.save(word);

    // 4. Crear y guardar el adjetivo relacionado con la palabra
    const adjective = this.adjectiveRepository.create({
      word,
      comparative: createAdjectiveDto.comparative,
      superlative: createAdjectiveDto.superlative,
    });
    await this.adjectiveRepository.save(adjective);

    // 5. Guardar imágenes si hay
    if (createAdjectiveDto.images && createAdjectiveDto.images.length) {
      for (const url of createAdjectiveDto.images) {
        await this.wordImageRepository.save({
          name: createAdjectiveDto.wordName,
          url,
          word,
        });
      }
    }

    // 6. Guardar pronunciaciones y fonemas
    for (const p of pronunciations) {
      const pronunciation = this.pronunciationRepository.create({
        locale: p.locale as PronunciationLocale,
        phonetic: p.phonetic,
        audioUrl: p.audioUrl,
        word,
      });
      await this.pronunciationRepository.save(pronunciation);

      for (const ph of p.phonemes) {
        const phoneme = this.phonemeRepository.create({
          symbol: ph.symbol,
          audioUrl: ph.audioUrl,
          example: ph.example,
          exampleAudioUrl: ph.exampleAudioUrl,
          pronunciation,
        });
        await this.phonemeRepository.save(phoneme);
      }
    }

    return adjective;
  }

async findAll(): Promise<AdjectiveResponseDto[]> {
  const adjectives = await this.adjectiveRepository.find({
    relations: {
      word: {
        type: true,
        images: true,
        pronunciations: {
          phonemes: true,
        },
      },
    },
  });

  return adjectives.map((adjective) => ({
    id: adjective.id,
    wordName: adjective.word?.name ?? '',
    comparative: adjective.comparative ?? '',
    superlative: adjective.superlative ?? '',
    typeName: adjective.word?.type?.name ?? '',
    images: adjective.word?.images?.map((img) => img.url) ?? [],
    pronunciations: (adjective.word?.pronunciations ?? []).map((pron) => ({
      locale: pron.locale,
      phonetic: pron.phonetic,
      audioUrl: pron.audioUrl,
      phonemes: (pron.phonemes ?? []).map((ph) => ({
        symbol: ph.symbol,
        audioUrl: ph.audioUrl,
        example: ph.example,
        exampleAudioUrl: ph.exampleAudioUrl,
      })),
    })),
  }));
}

  findOne(id: number) {
    return `This action returns a #${id} adjective`;
  }

  update(id: number, updateAdjectiveDto: UpdateAdjectiveDto) {
    return `This action updates a #${id} adjective`;
  }

  remove(id: number) {
    return `This action removes a #${id} adjective`;
  }
}
