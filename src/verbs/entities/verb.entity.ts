import { WordEntity } from 'src/words/entities/word.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('verbs')
export class VerbEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    enum: ['regular', 'irregular'],
  })
  typeVerb: string;

  // @Column()
  // public name: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => WordEntity, (word) => word.verb)
  @JoinColumn()
  word: WordEntity;
}
