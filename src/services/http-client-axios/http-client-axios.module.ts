import { Module } from '@nestjs/common';
import { HttpClientAxiosService } from './http-client-axios.service';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule],
  providers: [HttpClientAxiosService],
  exports: [HttpClientAxiosService],
})
export class HttpClientAxiosModule {}
