import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NounsService } from './nouns.service';
import { CreateNounDto } from './dto/create-noun.dto';
import { UpdateNounDto } from './dto/update-noun.dto';

@Controller('nouns')
export class NounsController {
  constructor(private readonly nounsService: NounsService) {}

  @Post()
  create(@Body() createNounDto: CreateNounDto) {
    return this.nounsService.create(createNounDto);
  }

  @Get()
  findAll() {
    return this.nounsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nounsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNounDto: UpdateNounDto) {
    return this.nounsService.update(+id, updateNounDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nounsService.remove(+id);
  }
}
