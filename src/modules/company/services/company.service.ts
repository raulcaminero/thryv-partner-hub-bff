import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyService {
  private readonly basePath = '/companies';

  constructor(private readonly httpService: HttpService, private readonly config: ConfigService) {}

  private getBaseUrl(): string {
    return this.config.get<string>('REMOTE_BACKEND_URL') || this.config.get<string>('REMOTE_API_URL') || '';
  }

  private async request<T>(method: string, path: string, data?: any, params?: any): Promise<T> {
    const url = `${this.getBaseUrl()}${path}`;
    try {
      const resp$ = this.httpService.request({ method: method as any, url, data, params });
      const resp = await lastValueFrom(resp$);
      return resp.data as T;
    } catch (err: any) {
      const status = err?.response?.status || HttpStatus.BAD_GATEWAY;
      const payload = err?.response?.data || { message: err?.message || 'Remote service error' };
      throw new HttpException(payload, status);
    }
  }

  async create(dto: CreateCompanyDto): Promise<Company> {
    return this.request<Company>('post', this.basePath, dto);
  }

  async findAll(limit = 10, lastKey?: any, status?: string) {
    const params: any = { limit };
    if (lastKey) params.lastKey = lastKey;
    if (status) params.status = status;
    return this.request<{ companies: Company[]; lastEvaluatedKey?: any; count: number }>('get', this.basePath, undefined, params);
  }

  async findOne(id: string): Promise<Company> {
    return this.request<Company>('get', `${this.basePath}/${encodeURIComponent(id)}`);
  }

  async findByIdentification(identification: string): Promise<Company> {
    return this.request<Company>('get', `${this.basePath}/identification/${encodeURIComponent(identification)}`);
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
    return this.request<Company>('put', `${this.basePath}/${encodeURIComponent(id)}`, dto);
  }

  async remove(id: string): Promise<void> {
    await this.request<void>('delete', `${this.basePath}/${encodeURIComponent(id)}`);
  }

  async softDelete(id: string): Promise<void> {
    try {
      await this.request<void>('patch', `${this.basePath}/${encodeURIComponent(id)}/soft-delete`);
    } catch (err) {
      await this.remove(id);
    }
  }

  async restore(id: string): Promise<Company> {
    return this.request<Company>('patch', `${this.basePath}/${encodeURIComponent(id)}/restore`);
  }
}