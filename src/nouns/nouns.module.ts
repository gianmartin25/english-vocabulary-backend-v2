import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapperModule } from 'src/services/scrapper/scrapper.module';
import { ScrapperService } from 'src/services/scrapper/scrapper.service';
import { PhonemeEntity } from 'src/words/entities/phoneme.entity';
import { PronunciationEntity } from 'src/words/entities/pronunciation.entity';
import { WordTypesEntity } from 'src/words/entities/word_types.entity';
import { WordImageEntity } from '../words/entities/word-image.entity';
import { WordEntity } from '../words/entities/word.entity';
import { NounEntity } from './entities/noun.entity';
import { NounsController } from './nouns.controller';
import { NounsService } from './nouns.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NounEntity,
      WordEntity,
      WordImageEntity,
      WordTypesEntity,
      PronunciationEntity,
      ScrapperService,
      PhonemeEntity,
    ]),
    ScrapperModule,
  ],
  providers: [NounsService],
  controllers: [NounsController],
  exports: [NounsService],
})
export class NounsModule {}
