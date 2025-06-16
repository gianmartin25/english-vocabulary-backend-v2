import { Module } from '@nestjs/common';
import { HttpClientAxiosModule } from '../http-client-axios/http-client-axios.module';
import { ScrapperService } from './scrapper.service';

@Module({
  imports: [HttpClientAxiosModule],
  providers: [ScrapperService],
  exports: [ScrapperService],
})
export class ScrapperModule {}
