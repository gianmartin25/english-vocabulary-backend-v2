import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdjectivesService } from './adjectives.service';
import { CreateAdjectiveDto } from './dto/create-adjective.dto';
import { UpdateAdjectiveDto } from './dto/update-adjective.dto';

@Controller('adjectives')
export class AdjectivesController {
  constructor(private readonly adjectivesService: AdjectivesService) {}

  @Post()
  create(@Body() createAdjectiveDto: CreateAdjectiveDto) {
    return this.adjectivesService.create(createAdjectiveDto);
  }

  @Get()
  findAll() {
    return this.adjectivesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adjectivesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdjectiveDto: UpdateAdjectiveDto,
  ) {
    return this.adjectivesService.update(+id, updateAdjectiveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adjectivesService.remove(+id);
  }
}
