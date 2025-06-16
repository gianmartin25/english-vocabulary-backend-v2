import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export interface IHttpClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, body: any): Promise<T>;
  put<T>(url: string, body: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

@Injectable()
export class HttpClientAxiosService implements IHttpClient {
  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(url, {
          responseType: 'text', // 🔹 Asegura que la respuesta sea HTML y no JSON
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          },
        }),
      );

      return response.data; // 🔹 Retornamos solo el HTML
    } catch (error: any) {
      console.error(`Error fetching URL: ${url}`, error);
      throw new Error(`Request failed for ${url}: ${error}`);
    }
  }

  async post<T>(url: string, body: any): Promise<T> {
    const response = await firstValueFrom(this.httpService.post<T>(url, body));
    return response.data;
  }
  async put<T>(url: string, body: any): Promise<T> {
    const response = await firstValueFrom(this.httpService.put<T>(url, body));
    return response.data;
  }
  async delete<T>(url: string): Promise<T> {
    const response = await firstValueFrom(this.httpService.delete<T>(url));
    return response.data;
  }
}
