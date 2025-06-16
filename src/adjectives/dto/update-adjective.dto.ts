import { PartialType } from '@nestjs/mapped-types';
import { CreateAdjectiveDto } from './create-adjective.dto';

export class UpdateAdjectiveDto extends PartialType(CreateAdjectiveDto) {}
