export class NounResponseDto {
  id: number;
  wordName: string;
  plural?: string;
  typeName?: string;
  images: string[];
  pronunciations: {
    locale: string;
    phonetic: string;
    audioUrl?: string;
    phonemes: {
      symbol: string;
      audioUrl?: string;
      example?: string;
      exampleAudioUrl?: string;
    }[];
  }[];
}