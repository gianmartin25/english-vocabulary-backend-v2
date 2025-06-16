

export const PronunciationTypesCountry ={
  UK: 'UK',
  US: 'US',
}

export class WordCountryServiceDTO {
  typeVerb: string;
  country: keyof typeof PronunciationTypesCountry;
  wordName: string;
  audioUrl: string;
  phonetic: string;
  characters: PhoenemeDTO[] = [];


  get getCharacters(): PhoenemeDTO[] {
    return this.characters;
  }

  addCharacter(character: PhoenemeDTO): void {
    this.characters.push(character);
  }

  getPhonetic(): string {
    return this.phonetic;
  }

  setPhonetic(phonetic: string) {
    this.phonetic = phonetic;
  }

  getWordName(): string {
    return this.wordName;
  }

  setWordName(verbName: string) {
    this.wordName = verbName;
  }

  getCountry(): keyof typeof PronunciationTypesCountry {
    return this.country;
  }

  setCountry(country: keyof typeof PronunciationTypesCountry) {
    this.country = country;
  }

  setAudioUrl(audioUrl: string) {
    this.audioUrl = audioUrl;
  }

  getAudioUrl(): string {
    return this.audioUrl;
  }
}

export class PhoenemeDTO {
  phoenemeName: string;
  wordExample: string;
  private audioPhoenemeUrl: string;

  getPhoneme(): string {
    return this.phoenemeName;
  }

  setPhoneme(phoneticCharacter: string) {
    this.phoenemeName = phoneticCharacter;
  }

  getWordExample(): string {
    return this.wordExample;
  }

  setWordExample(wordExample: string) {
    this.wordExample = wordExample;
  }

  getAudioPhoenemeUrl(): string {
    return this.audioPhoenemeUrl;
  }

  setAudioPhonemeUrl(audioCharacterUrl: string) {
    this.audioPhoenemeUrl = audioCharacterUrl;
  }
}
