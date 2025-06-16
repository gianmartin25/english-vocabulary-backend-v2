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
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
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

  async create(createArticleDto: CreateArticleDto) {
    // 1. Scrapea información adicional
    const pronunciations = await this.scrapperService.scrapeWebsite(
      'https://dictionary.cambridge.org/pronunciation/english/',
      createArticleDto,
    );

    // 2. Busca o crea el tipo "article"
    let type = await this.wordTypesRepository.findOne({
      where: { name: 'article' },
    });
    if (!type) {
      type = this.wordTypesRepository.create({ name: 'article' });
      await this.wordTypesRepository.save(type);
    }

    console.log({ createArticleDto });

    // 3. Crear y guardar la palabra con el tipo
    const word = this.wordRepository.create({
      name: createArticleDto.wordName,
      type,
    });
    await this.wordRepository.save(word);

    // 4. Crear y guardar el artículo relacionado con la palabra
    const article = this.articleRepository.create({
      word,
      type: createArticleDto.type,
    });
    await this.articleRepository.save(article);

    // 5. Guardar imágenes si hay
    if (createArticleDto.images && createArticleDto.images.length) {
      for (const url of createArticleDto.images) {
        await this.wordImageRepository.save({
          name: createArticleDto.wordName,
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

    return article;
  }

async findAll(): Promise<ArticleResponseDto[]> {
  const articles = await this.articleRepository.find({
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

  return articles.map((article) => ({
    id: article.id,
    wordName: article.word?.name ?? '',
    type: article.type ?? '',
    typeName: article.word?.type?.name ?? '',
    images: article.word?.images?.map((img) => img.url) ?? [],
    pronunciations: (article.word?.pronunciations ?? []).map((pron) => ({
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
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
