import { WordEntity } from 'src/words/entities/word.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public type: string;

  // @Column()
  // public text: string;

  @OneToOne(() => WordEntity, (word) => word.article)
  @JoinColumn()
  public word: WordEntity;
}
