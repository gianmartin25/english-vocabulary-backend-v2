import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { WordEntity } from '../../words/entities/word.entity';
import { PhonemeEntity } from './phoneme.entity';


export enum PronunciationLocale {
  UK = 'UK',
  US = 'US',
}

@Entity('pronunciations')
export class PronunciationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  locale: PronunciationLocale;

  @Column()
  phonetic: string;

  @Column({ nullable: true })
  audioUrl?: string; // Audio de la palabra completa

  @ManyToOne(() => WordEntity, (word) => word.pronunciations)
  word: WordEntity;

  @OneToMany(() => PhonemeEntity, (phoneme) => phoneme.pronunciation, { cascade: true })
  phonemes: PhonemeEntity[];
}