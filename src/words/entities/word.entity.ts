import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WordImageEntity } from './word-image.entity';
import { WordTypesEntity } from './word_types.entity';
import { NounEntity } from 'src/nouns/entities/noun.entity';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';
import { AdjectiveEntity } from 'src/adjectives/entities/adjective.entity';
import { ArticleEntity } from 'src/articles/entities/article.entity';
import { PronunciationEntity } from './pronunciation.entity';
import { VerbEntity } from 'src/verbs/entities/verb.entity';

@Entity('words')
export class WordEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  // @OneToOne(() => WordTypesModel, (wordType) => wordType.id)
  // public typeId: WordTypesModel;

  // En word.entity.ts
  @OneToOne(() => NounEntity, (noun) => noun.id)
  noun: NounEntity;

  @OneToOne(() => SubjectEntity, (subject) => subject.word)
  subject: SubjectEntity;

  @OneToOne(() => AdjectiveEntity, (adjective) => adjective.word)
  adjective: AdjectiveEntity;

  @OneToOne(() => ArticleEntity, (article) => article.word)
  article: ArticleEntity;

  @OneToOne(() => VerbEntity, (verb) => verb.word)
  verb: VerbEntity;

  @ManyToOne(() => WordTypesEntity, (wordType) => wordType.id)
  public type: WordTypesEntity;

  @OneToMany(() => WordImageEntity, (wordImage) => wordImage.word)
  public images: WordImageEntity[];

  @OneToMany(() => PronunciationEntity, (pron) => pron.word)
  pronunciations: PronunciationEntity[];
}
