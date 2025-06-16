import { NestFactory } from '@nestjs/core';
import * as fs from 'fs/promises';
import * as path from 'path';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { AppModule } from './app.module';
import { CreateVerbDto } from './verbs/dto/create-verb.dto';
import { CreateNounDto } from './nouns/dto/create-noun.dto';
import { CreateAdjectiveDto } from './adjectives/dto/create-adjective.dto';
import { CreateArticleDto } from './articles/dto/create-article.dto';
import { CreateSubjectDto } from './subjects/dto/create-subject.dto';
import { VerbsService } from './verbs/verbs.service';
import { NounsService } from './nouns/nouns.service';
import { AdjectivesService } from './adjectives/adjectives.service';
import { ArticlesService } from './articles/articles.service';
import { SubjectsService } from './subjects/subjects.service';

type FileConfig = {
  file: string;
  dto: ClassConstructor<unknown>;
  label: string;
  service: string;
};

const files: FileConfig[] = [
  {
    file: 'verbs.json',
    dto: CreateVerbDto,
    label: 'Verbo',
    service: 'VerbsService',
  },
  {
    file: 'nouns.json',
    dto: CreateNounDto,
    label: 'Sustantivo',
    service: 'NounsService',
  },
  {
    file: 'adjectives.json',
    dto: CreateAdjectiveDto,
    label: 'Adjetivo',
    service: 'AdjectivesService',
  },
  {
    file: 'articles.json',
    dto: CreateArticleDto,
    label: 'Artículo',
    service: 'ArticlesService',
  },
  {
    file: 'subjects.json',
    dto: CreateSubjectDto,
    label: 'Sujeto',
    service: 'SubjectsService',
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processFile(
  fileConfig: FileConfig,
  services: Record<string, { create: (dto: object) => Promise<unknown> }>,
) {
  const dataPath = path.resolve(process.cwd(), 'src', 'data', fileConfig.file);
  const rawData = await fs.readFile(dataPath, 'utf8');
  // Tipado seguro para evitar any/unknown
  const items = JSON.parse(rawData) as Record<string, unknown>[];

  for (const [index, item] of items.entries()) {
    // Validar que el objeto tenga al menos wordName
    if (!('wordName' in item) || typeof item.wordName !== 'string') {
      console.error(
        `Saltando ${fileConfig.label} #${index + 1}: falta 'wordName'`,
      );
      continue;
    }
    // plainToInstance espera un objeto
    const dto = plainToInstance(fileConfig.dto, item as object);
    const errors = await validate(dto as object);
    if (errors.length > 0) {
      console.error(`Errores en ${fileConfig.label} #${index + 1}`, errors);
      continue;
    }

    try {
      const service = services[fileConfig.service];
      if (service && typeof service.create === 'function') {
        console.log({ dto });
        await service.create(dto as object);
        console.log(
          `${fileConfig.label} #${index + 1} guardado correctamente.`,
        );
      } else {
        console.error(`Servicio no encontrado para ${fileConfig.label}`);
      }
    } catch (err) {
      console.error(`Error guardando ${fileConfig.label} #${index + 1}:`, err);
    }

    // Espera entre 1.5 y 2.5 segundos antes de la siguiente petición
    const ms = 1500 + Math.random() * 1000;
    await delay(ms);
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);

  const services = {
    VerbsService: app.get(VerbsService),
    NounsService: app.get(NounsService),
    AdjectivesService: app.get(AdjectivesService),
    ArticlesService: app.get(ArticlesService),
    SubjectsService: app.get(SubjectsService),
  };

  for (const fileConfig of files) {
    console.log(`Procesando ${fileConfig.label}...`);
    await processFile(fileConfig, services);
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Error en bootstrap:', err);
});
