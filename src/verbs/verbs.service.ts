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
import { CreateVerbDto } from './dto/create-verb.dto';
import { VerbEntity } from './entities/verb.entity';
import { UpdateVerbDto } from './dto/update-verb.dto';
import { VerbResponseDto } from './dto/verb-response.dto';



@Injectable()
export class VerbsService {
  constructor(
    @InjectRepository(VerbEntity)
    private readonly verbRepository: Repository<VerbEntity>,
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

  async create(createVerbDto: CreateVerbDto) {
    // 1. Scrapea información adicional
    const pronunciations = await this.scrapperService.scrapeWebsite(
      'https://dictionary.cambridge.org/pronunciation/english/',
      createVerbDto,
    );

    // ...existing code...
    // 2. Busca o crea el tipo "verb"
    let type = await this.wordTypesRepository.findOne({
      where: { name: 'verb' },
    });
    if (!type) {
      type = this.wordTypesRepository.create({ name: 'verb' });
      await this.wordTypesRepository.save(type);
    }
    // ...existing code...

    // 3. Crear y guardar la palabra con el tipo
    const word = this.wordRepository.create({
      name: createVerbDto.wordName,
      type,
    });
    await this.wordRepository.save(word);

    // 4. Crear y guardar el verbo relacionado con la palabra
    const verb = this.verbRepository.create({
      word,
      typeVerb: createVerbDto.typeVerb,
    });
    await this.verbRepository.save(verb);

    // 5. Guardar imágenes si hay
    if (createVerbDto.images && createVerbDto.images.length) {
      for (const url of createVerbDto.images) {
        await this.wordImageRepository.save({
          name: createVerbDto.wordName,
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

    return verb;
  }

  async findAll(): Promise<VerbResponseDto[]> {
    const verbs = await this.verbRepository.find({
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

    return verbs.map((verb) => ({
      id: verb.id,
      wordName: verb.word?.name ?? '',
      typeVerb: verb.typeVerb ?? '',
      typeName: verb.word?.type?.name ?? '',
      images: verb.word?.images.map((img) => img.url) ?? [],
      pronunciations: (verb.word?.pronunciations ?? []).map((pron) => ({
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
    return `This action returns a #${id} verb`;
  }

  update(id: number, updateVerbDto: UpdateVerbDto) {
    return `This action updates a #${id} verb`;
  }

  remove(id: number) {
    return `This action removes a #${id} verb`;
  }
}
