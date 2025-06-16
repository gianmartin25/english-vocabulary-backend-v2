export class AdjectiveResponseDto {
  id: number;
  wordName: string;
  comparative?: string;
  superlative?: string;
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