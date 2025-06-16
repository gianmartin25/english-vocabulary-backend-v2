import { Test, TestingModule } from '@nestjs/testing';
import { HttpClientAxiosService } from './http-client-axios.service';

describe('HttpClientAxiosService', () => {
  let service: HttpClientAxiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpClientAxiosService],
    }).compile();

    service = module.get<HttpClientAxiosService>(HttpClientAxiosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
