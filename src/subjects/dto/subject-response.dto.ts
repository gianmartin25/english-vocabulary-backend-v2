export class SubjectResponseDto {
  id: number;
  wordName: string;
  person?: string;
  number?: string;
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