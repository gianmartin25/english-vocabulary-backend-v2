import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateAdjectiveDto {
  @IsString()
  wordName: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  comparative?: string;

  @IsString()
  @IsOptional()
  superlative?: string;
}