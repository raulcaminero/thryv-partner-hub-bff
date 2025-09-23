import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerService {
  private readonly basePath = '/customers';

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

  async create(dto: CreateCustomerDto): Promise<Customer> {
    return this.request<Customer>('post', this.basePath, dto);
  }

  async findAll(page = 1, limit = 10, status?: string) {
    const params: any = { page, limit };
    if (status) params.status = status;
    return this.request<{ customers: Customer[]; total: number; page: number; totalPages: number }>(
      'get',
      this.basePath,
      undefined,
      params,
    );
  }

  async findOne(id: string): Promise<Customer> {
    return this.request<Customer>('get', `${this.basePath}/${encodeURIComponent(id)}`);
  }

  async findByIdentification(identification: string): Promise<Customer> {
    return this.request<Customer>('get', `${this.basePath}/identification/${encodeURIComponent(identification)}`);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    return this.request<Customer>('put', `${this.basePath}/${encodeURIComponent(id)}`, dto);
  }

  async remove(id: string): Promise<void> {
    await this.request<void>('delete', `${this.basePath}/${encodeURIComponent(id)}`);
  }

  async softDelete(id: string): Promise<void> {
    // If remote backend exposes a soft-delete endpoint, call it; otherwise call delete
    try {
      await this.request<void>('patch', `${this.basePath}/${encodeURIComponent(id)}/soft-delete`);
    } catch (err) {
      // fallback to delete if soft-delete missing
      await this.remove(id);
    }
  }

  async restore(id: string): Promise<Customer> {
    return this.request<Customer>('patch', `${this.basePath}/${encodeURIComponent(id)}/restore`);
  }
}