import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScrapperService } from 'src/services/scrapper/scrapper.service';
import { Repository } from 'typeorm';
import { PhonemeEntity } from '../words/entities/phoneme.entity';
import {
  PronunciationEntity,
  PronunciationLocale,
} from '../words/entities/pronunciation.entity';
import { WordImageEntity } from '../words/entities/word-image.entity';
import { WordEntity } from '../words/entities/word.entity';
import { WordTypesEntity } from '../words/entities/word_types.entity';
import { CreateNounDto } from './dto/create-noun.dto';
import { NounResponseDto } from './dto/noun-response.dto';
import { UpdateNounDto } from './dto/update-noun.dto';
import { NounEntity } from './entities/noun.entity';

@Injectable()
export class NounsService {
  constructor(
    @InjectRepository(NounEntity)
    private readonly nounRepository: Repository<NounEntity>,
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

  async create(createNounDto: CreateNounDto) {
    // 1. Scrapea información adicional si lo necesitas
    const pronunciations = await this.scrapperService.scrapeWebsite(
      'https://dictionary.cambridge.org/pronunciation/english/',
      createNounDto,
    );
    // 1. Busca o crea el tipo "noun"
    let type = await this.wordTypesRepository.findOne({
      where: { name: 'noun' },
    });
    if (!type) {
      type = this.wordTypesRepository.create({ name: 'noun' });
      await this.wordTypesRepository.save(type);
    }

    // 2. Crear y guardar la palabra con el tipo
    const word = this.wordRepository.create({
      name: createNounDto.wordName,
      type,
    });
    await this.wordRepository.save(word);

    // 3. Crear y guardar el noun relacionado con la palabra
    const noun = this.nounRepository.create({
      word,
      plural: createNounDto.plural,
    });
    await this.nounRepository.save(noun);

    // 4. Guardar imágenes si hay
    if (createNounDto.images && createNounDto.images.length) {
      for (const url of createNounDto.images) {
        await this.wordImageRepository.save({
          name: createNounDto.wordName,
          url,
          word,
        });
      }
    }

    // 5. Guardar pronunciaciones y fonemas
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

    return noun;
  }

 async findAll(): Promise<NounResponseDto[]> {
  const nouns = await this.nounRepository.find({
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

  return nouns.map((noun) => ({
    id: noun.id,
    wordName: noun.word?.name ?? '',
    plural: noun.plural ?? '',
    typeName: noun.word?.type?.name ?? '',
    images: noun.word?.images?.map((img) => img.url) ?? [],
    pronunciations: (noun.word?.pronunciations ?? []).map((pron) => ({
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
    return `This action returns a #${id} noun`;
  }

  update(id: number, updateNounDto: UpdateNounDto) {
    return `This action updates a #${id} noun`;
  }

  remove(id: number) {
    return `This action removes a #${id} noun`;
  }
}
