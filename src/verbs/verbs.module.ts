import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapperModule } from 'src/services/scrapper/scrapper.module';
import { ScrapperService } from 'src/services/scrapper/scrapper.service';
import { PhonemeEntity } from 'src/words/entities/phoneme.entity';
import { PronunciationEntity } from 'src/words/entities/pronunciation.entity';
import { WordImageEntity } from 'src/words/entities/word-image.entity';
import { WordEntity } from 'src/words/entities/word.entity';
import { WordTypesEntity } from 'src/words/entities/word_types.entity';
import { VerbEntity } from './entities/verb.entity';
import { VerbsController } from './verbs.controller';
import { VerbsService } from './verbs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VerbEntity,
      WordEntity,
      WordImageEntity,
      WordTypesEntity,
      PronunciationEntity,
      ScrapperService,
      PhonemeEntity,
    ]),
    ScrapperModule,
  ],
  controllers: [VerbsController],
  providers: [VerbsService],
  exports: [VerbsService],
})
export class VerbsModule {}
