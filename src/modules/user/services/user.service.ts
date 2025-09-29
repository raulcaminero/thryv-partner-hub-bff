import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as https from 'https';

@Injectable()
export class UserService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private readonly httpService: HttpService) {}

  private async request<T>(path: string, params?: any): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    try {
       // Include dev-only httpsAgent when DISABLE_SSL_VERIFY=true to bypass corporate/local TLS issues.
      const axiosConfig: any = { params };
      if (process.env.NODE_ENV !== 'production' && process.env.DISABLE_SSL_VERIFY === 'true') {
        axiosConfig.httpsAgent = new https.Agent({ rejectUnauthorized: false });
      }
      const resp$ = this.httpService.get(url, axiosConfig);
      const resp = await lastValueFrom(resp$);
      return resp.data as T;
    } catch (err: any) {
      const status = err?.response?.status || HttpStatus.BAD_GATEWAY;
      const payload = err?.response?.data || { message: err?.message || 'Remote service error' };
      throw new HttpException(payload, status);
    }
  }

  async getUsers() {
    return this.request<any[]>('/users');
  }

  async getUser(id: string) {
    return this.request<any>(`/users/${encodeURIComponent(id)}`);
  }

  async getPosts() {
    return this.request<any[]>('/posts');
  }

  async getPostsByUser(userId: string) {
    return this.request<any[]>('/posts', { userId });
  }
}