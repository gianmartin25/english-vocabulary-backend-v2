import { WordCountryServiceDTO } from './WordCountryServiceDTO.dto';

export class WordServiceDTO {
  private countriesWord: WordCountryServiceDTO[] = [];
  private images: string[] = [];

  constructor() {
    this.countriesWord = [];
    this.images = [];
  }

  getImages(): string[] {
    return this.images;
  }

  addImage(image: string): void {
    this.images.push(image);
  }

  getCountriesWord(): WordCountryServiceDTO[] {
    return this.countriesWord;
  }

  setCountryWord(countriesVerb: WordCountryServiceDTO[]): void {
    this.countriesWord = countriesVerb;
  }
}
