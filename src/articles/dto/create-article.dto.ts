import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  wordName: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  type?: string; // definite/indefinite
}