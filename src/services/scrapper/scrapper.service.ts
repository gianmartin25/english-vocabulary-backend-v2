import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as cheerio from 'cheerio';
import { HttpClientAxiosService } from '../http-client-axios/http-client-axios.service';


interface IWord {
  wordName: string;
}

@Injectable()
export class ScrapperService {
  private readonly logger = new Logger(ScrapperService.name);

  constructor(private httpClientAxiosService: HttpClientAxiosService) {}

  async scrapeWebsite(
    url: string,
    word: IWord,
  ): Promise<
    Array<{
      locale: 'UK' | 'US';
      phonetic: string;
      audioUrl?: string;
      phonemes: Array<{
        symbol: string;
        audioUrl?: string;
        example?: string;
        exampleAudioUrl?: string;
      }>;
    }>
  > {
    const pronunciations: Array<{
      locale: 'UK' | 'US';
      phonetic: string;
      audioUrl?: string;
      phonemes: Array<{
        symbol: string;
        audioUrl?: string;
        example?: string;
        exampleAudioUrl?: string;
      }>;
    }> = [];

    try {
      const html = await this.httpClientAxiosService.get<string>(
        `${url}${word.wordName}`,
      );
      const $ = cheerio.load(html);
      const $containerDivPronunciation = $('div.lp-10.lb.lbt0').first();

      if (!$containerDivPronunciation.length) {
        this.logger.warn(
          `No se encontró pronunciación en ${url}${word.wordName}`,
        );
        return pronunciations;
      }

      const $containersCountryPronunciation =
        $containerDivPronunciation.children();

      $containersCountryPronunciation.each((_, element) => {
        const $countryElement = $(element).find('.daud.t.tb.fs16.lmr-15');
        const $titlePronunciation = $(element).find('.section-header.lmb-10');

        const audioUrl = $titlePronunciation
          .find('audio source[type="audio/mpeg"]')
          .attr('src');
        const fullAudioUrl = audioUrl
          ? `https://dictionary.cambridge.org${audioUrl}`
          : undefined;

        const phonetic = $titlePronunciation
          .find('[data-title="Written pronunciation"].pron')
          .text();
        const countryText = $countryElement.text().trim();
        const locale = countryText === 'UK' ? 'UK' : 'US';

        // Fonemas
        const $containerCharacters = $(element).find('.hul-u');
        const phonemes: Array<{
          symbol: string;
          audioUrl?: string;
          example?: string;
          exampleAudioUrl?: string;
        }> = [];

        $containerCharacters.children().each((_, characterElement) => {
          const $character = $(characterElement);
          const audioCharacterUrl =
            $character
              .find('audio source[type="audio/mpeg"]')
              .first()
              .attr('src') ?? '';
          const symbol =
            $character
              .find('span[data-title="Written pronunciation"].pron')
              .text() ?? '';
          const example = $character.find('.word').text() ?? '';
          // Si tienes el audio de la palabra de ejemplo, obténlo aquí:
          const exampleAudioUrl =
            $character
              .find('.word audio source[type="audio/mpeg"]')
              .first()
              .attr('src') ?? '';

          phonemes.push({
            symbol: symbol.trim(),
            audioUrl: audioCharacterUrl
              ? `https://dictionary.cambridge.org${audioCharacterUrl}`
              : undefined,
            example: example.trim() || undefined,
            exampleAudioUrl: exampleAudioUrl
              ? `https://dictionary.cambridge.org${exampleAudioUrl}`
              : undefined,
          });
        });

        pronunciations.push({
          locale,
          phonetic: phonetic.trim(),
          audioUrl: fullAudioUrl,
          phonemes,
        });
      });

      return pronunciations;
    } catch (error) {
      this.logger.error(`Error scrapeando ${url}${word.wordName}`, error);
      throw new InternalServerErrorException('Scraping failed');
    }
  }
}
