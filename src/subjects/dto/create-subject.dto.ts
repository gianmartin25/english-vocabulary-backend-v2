import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  wordName: string;

  @IsArray()
  images: string[];

  @IsString()
  @IsOptional()
  person?: string;

  @IsString()
  @IsOptional()
  number?: string;
}