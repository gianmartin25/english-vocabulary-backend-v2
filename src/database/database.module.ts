import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdjectivesModule } from 'src/adjectives/adjectives.module';
import { ArticlesModule } from 'src/articles/articles.module';
import { NounsModule } from 'src/nouns/nouns.module';
import { SubjectsModule } from 'src/subjects/subjects.module';
import { VerbsModule } from 'src/verbs/verbs.module';
import { WordsModule } from 'src/words/words.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        AdjectivesModule,
        ArticlesModule,
        NounsModule,
        // PhonemeModule,
        // SentenceModule,
        SubjectsModule,
        VerbsModule,
        WordsModule,

      ],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
         entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true, // Be cautious about using synchronize in production
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
