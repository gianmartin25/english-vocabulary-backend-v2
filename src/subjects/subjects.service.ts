import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from 'src/words/entities/word.entity';
import { WordImageEntity } from 'src/words/entities/word-image.entity';
import { Repository } from 'typeorm';
import { SubjectEntity } from './entities/subject.entity';
import { ScrapperService } from 'src/services/scrapper/scrapper.service';
import { WordTypesEntity } from 'src/words/entities/word_types.entity';
import { PronunciationEntity, PronunciationLocale } from 'src/words/entities/pronunciation.entity';
import { PhonemeEntity } from 'src/words/entities/phoneme.entity';
import { SubjectResponseDto } from './dto/subject-response.dto';

@Injectable()
export class SubjectsService {
   constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
    @InjectRepository(WordImageEntity)
    private readonly wordImageRepository: Repository<WordImageEntity>,
    @InjectRepository(WordTypesEntity)
    private readonly wordTypesRepository: Repository<WordTypesEntity>,
    @InjectRepository(PronunciationEntity)
    private readonly pronunciationRepository: Repository<PronunciationEntity>,
    @InjectRepository(PhonemeEntity)
    private readonly phonemeRepository: Repository<PhonemeEntity>,
    private readonly scrapperService: ScrapperService,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    // 1. Scrapea información adicional si lo necesitas
    const pronunciations = await this.scrapperService.scrapeWebsite(
      'https://dictionary.cambridge.org/pronunciation/english/',
      createSubjectDto,
    );

    // 2. Busca o crea el tipo "subject"
    let type = await this.wordTypesRepository.findOne({ where: { name: 'subject' } });
    if (!type) {
      type = this.wordTypesRepository.create({ name: 'subject' });
      await this.wordTypesRepository.save(type);
    }

    // 3. Crear y guardar la palabra con el tipo
    const word = this.wordRepository.create({
      name: createSubjectDto.wordName,
      type,
    });
    await this.wordRepository.save(word);

    for (const p of pronunciations) {
      const pronunciation = this.pronunciationRepository.create({
        locale: p.locale as PronunciationLocale,
        phonetic: p.phonetic,
        audioUrl: p.audioUrl,
        word, // la instancia de WordEntity creada antes
      });
      await this.pronunciationRepository.save(pronunciation);

      // Guardar fonemas
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

    

    // 4. Crear y guardar el subject relacionado con la palabra
    const subject = this.subjectRepository.create({
      word,
      person: createSubjectDto.person,
      number: createSubjectDto.number,
    });
    await this.subjectRepository.save(subject);

    // 5. Guardar imágenes si hay
    if (createSubjectDto.images && createSubjectDto.images.length) {
      for (const url of createSubjectDto.images) {
        await this.wordImageRepository.save({
          name: createSubjectDto.wordName,
          url,
          word,
        });
      }
    }

    return subject;
  }

async findAll(): Promise<SubjectResponseDto[]> {
  const subjects = await this.subjectRepository.find({
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

  return subjects.map((subject) => ({
    id: subject.id,
    wordName: subject.word?.name ?? '',
    person: subject.person ?? '',
    number: subject.number ?? '',
    typeName: subject.word?.type?.name ?? '',
    images: subject.word?.images?.map((img) => img.url) ?? [],
    pronunciations: (subject.word?.pronunciations ?? []).map((pron) => ({
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
    return `This action returns a #${id} subject`;
  }

  update(id: number, updateSubjectDto: UpdateSubjectDto) {
    return `This action updates a #${id} subject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subject`;
  }
}
