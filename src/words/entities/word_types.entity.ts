import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("word_types")
export class WordTypesEntity {

  @PrimaryGeneratedColumn()
  public id: number;   

  @Column()
  public name: string; 
}
