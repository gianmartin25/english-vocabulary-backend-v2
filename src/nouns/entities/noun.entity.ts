import { WordEntity } from "src/words/entities/word.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('nouns')
export class NounEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @OneToOne(() => WordEntity, (word) => word.noun)
    @JoinColumn()
    public word: WordEntity;

    @Column()
    public plural: string;
}