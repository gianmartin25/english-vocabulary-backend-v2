import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PronunciationEntity } from './pronunciation.entity';

@Entity('phonemes')
export class PhonemeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column({ nullable: true })
  audioUrl?: string; // Audio del fonema

  @Column({ nullable: true })
  example?: string; // Ejemplo de palabra

  @Column({ nullable: true })
  exampleAudioUrl?: string; // Audio de la palabra de ejemplo

  @ManyToOne(() => PronunciationEntity, (pronunciation) => pronunciation.phonemes)
  pronunciation: PronunciationEntity;
}