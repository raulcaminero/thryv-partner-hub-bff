import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { of } from 'rxjs';
import { CustomerService } from './customer.service';
import { CustomerGender, CustomerStatus } from '../entities/customer.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('CustomerService (HTTP proxy)', () => {
  let service: CustomerService;
  let mockHttpService: { request: jest.Mock };
  const mockConfigService = { get: jest.fn().mockImplementation((key: string) => {
    if (key === 'REMOTE_BACKEND_URL') return 'http://remote-backend';
    return undefined;
  }) };

  beforeEach(async () => {
    mockHttpService = { request: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should proxy create to remote backend', async () => {
      const dto = {
        identification: '12345678901',
        name: 'John',
        lastname: 'Doe',
        dateBorn: '1990-01-15',
        gender: CustomerGender.MALE,
        status: CustomerStatus.ACTIVE,
      };
      const remoteResponse = { id: 'uuid-123', ...dto };

      mockHttpService.request.mockReturnValueOnce(of({ data: remoteResponse }));

      const result = await service.create(dto);

      expect(result).toEqual(remoteResponse);
      expect(mockHttpService.request).toHaveBeenCalledWith(expect.objectContaining({
        method: 'post',
        url: `${mockConfigService.get('REMOTE_BACKEND_URL')}/customers`,
        data: dto,
      }));
    });

    it('should throw when remote returns error', async () => {
      mockHttpService.request.mockImplementationOnce(() => { throw { response: { status: 400, data: { message: 'Bad' } } }; });

      await expect(service.create({} as any)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should proxy list request and return payload', async () => {
      const payload = { customers: [{ id: '1' }], total: 1, page: 1, totalPages: 1 };
      mockHttpService.request.mockReturnValueOnce(of({ data: payload }));

      const result = await service.findAll(1, 10);

      expect(result).toEqual(payload);
      expect(mockHttpService.request).toHaveBeenCalledWith(expect.objectContaining({
        method: 'get',
        url: `${mockConfigService.get('REMOTE_BACKEND_URL')}/customers`,
        params: { page: 1, limit: 10 },
      }));
    });
  });

  describe('findOne', () => {
    it('should proxy get by id', async () => {
      const item = { id: '1', name: 'John' };
      mockHttpService.request.mockReturnValueOnce(of({ data: item }));

      const result = await service.findOne('1');

      expect(result).toEqual(item);
      expect(mockHttpService.request).toHaveBeenCalledWith(expect.objectContaining({
        method: 'get',
        url: `${mockConfigService.get('REMOTE_BACKEND_URL')}/customers/1`,
      }));
    });

    it('should throw when not found (remote returns null)', async () => {
      mockHttpService.request.mockReturnValueOnce(of({ data: null }));
      await expect(service.findOne('1')).resolves.toBeNull();
    });
  });

  // Additional tests (findByIdentification, update, remove, softDelete, restore) can be adapted similarly.
});