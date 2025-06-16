import { WordEntity } from 'src/words/entities/word.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('adjectives')
export class AdjectiveEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => WordEntity, (word: WordEntity) => word.adjective)
  @JoinColumn()
  public word: WordEntity;

  @Column()
  public comparative: string;

  @Column()
  public superlative: string;
}
