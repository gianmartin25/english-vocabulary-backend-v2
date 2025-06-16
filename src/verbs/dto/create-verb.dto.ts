import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateVerbDto {
  @IsString()
  wordName: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  typeVerb?: string; // regular/irregular
}