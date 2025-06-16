import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhonemeEntity } from 'src/words/entities/phoneme.entity';
import { PronunciationEntity } from 'src/words/entities/pronunciation.entity';
import { WordImageEntity } from 'src/words/entities/word-image.entity';
import { WordEntity } from 'src/words/entities/word.entity';
import { WordTypesEntity } from 'src/words/entities/word_types.entity';
import { SubjectEntity } from './entities/subject.entity';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { ScrapperService } from 'src/services/scrapper/scrapper.service';
import { ScrapperModule } from 'src/services/scrapper/scrapper.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubjectEntity,
      WordEntity,
      WordTypesEntity,
      WordImageEntity,
      PronunciationEntity,
      PhonemeEntity,
    ]),
    ScrapperModule
  ],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {}