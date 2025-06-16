import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  englishLevel: string;

  @IsString()
  learningGoals: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}