import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// ...existing code...

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita la validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
    transform: true, // Transforma payloads a los tipos DTO
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();