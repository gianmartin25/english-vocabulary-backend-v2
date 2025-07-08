import { Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WordEntity } from './entities/word.entity';
import { Repository } from 'typeorm';
import { SearchResponseDto } from './dto/search-response.dto';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(WordEntity)
    private readonly wordRepository: Repository<WordEntity>,
  ) {}

  create(createWordDto: CreateWordDto) {
    return 'This action adds a new word';
  }

  findAll() {
    return `This action returns all words`;
  }

 // ...existing code...

async searchWords(query: string): Promise<SearchResponseDto[]> {
  const words = await this.wordRepository
    .createQueryBuilder('word')
    .leftJoinAndSelect('word.type', 'type')
    .leftJoinAndSelect('word.images', 'images')
    .leftJoinAndSelect('word.pronunciations', 'pronunciations')
    .leftJoinAndSelect('pronunciations.phonemes', 'phonemes')
    .where('LOWER(word.name) LIKE LOWER(:query)', { query: `%${query}%` })
    .take(5)
    .getMany();

  return words.map((word) => ({
    id: word.id,
    wordName: word.name,
    typeName: word.type?.name ?? '',
    images: word.images?.map((img) => img.url) ?? [],
    pronunciations: (word.pronunciations ?? []).map((pron) => ({
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

// ...existing code...

  findOne(id: number) {
    return `This action returns a #${id} word`;
  }

  update(id: number, updateWordDto: UpdateWordDto) {
    return `This action updates a #${id} word`;
  }

  remove(id: number) {
    return `This action removes a #${id} word`;
  }
}
