import { WordEntity } from "src/words/entities/word.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("subjects")
export class SubjectEntity{
    @PrimaryGeneratedColumn()
    public id: number;

    // @Column()
    // public text: string;

    @Column()
    public person: string;
    @Column()
    public number: string;

    @OneToOne(()=> WordEntity, (word) => word.subject)
    @JoinColumn()
    public word: WordEntity;
}