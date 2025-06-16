import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WordEntity } from "./word.entity";


@Entity("word_images")
export class WordImageEntity {
    @PrimaryGeneratedColumn()
    public id: number;



    @Column()
    public name: string;

    @Column()
    public url: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    public createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    public updatedAt: Date;

    @ManyToOne(() => WordEntity, (word) => word.images)
    public word: WordEntity;
    

}