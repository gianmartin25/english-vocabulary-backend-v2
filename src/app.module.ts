import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerbsModule } from './verbs/verbs.module';
import { AdjectivesModule } from './adjectives/adjectives.module';
import { NounsModule } from './nouns/nouns.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ArticlesModule } from './articles/articles.module';
import { WordsModule } from './words/words.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ScrapperModule } from './services/scrapper/scrapper.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    VerbsModule,
    AdjectivesModule,
    NounsModule,
    SubjectsModule,
    ArticlesModule,
    WordsModule,
    UsersModule,
    ScrapperModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
