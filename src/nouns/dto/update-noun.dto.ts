import { PartialType } from '@nestjs/mapped-types';
import { CreateNounDto } from './create-noun.dto';

export class UpdateNounDto extends PartialType(CreateNounDto) {}
