import { IsString, IsArray } from 'class-validator';

export class CreateNounDto {
  @IsString()
  wordName: string;

  @IsArray()
  images: string[];

  @IsString()
  plural: string;
}