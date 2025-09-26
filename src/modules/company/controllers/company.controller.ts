import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Patch, 
  Body, 
  Param, 
  Query, 
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CompanyService } from '../services/company.service';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto';
import { ApiCrudController } from '../../../common/decorators/base-crud.decorator';
import { ApiCrudOperation, ApiFindByIdentification } from '../../../common/decorators/api-crud.decorator';

@ApiCrudController('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiCrudOperation('create', 'Company')
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<any> {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiCrudOperation('findAll', 'Company')
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'lastKey', required: false, type: String, description: 'Last evaluated key for pagination' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  async findAll(
    @Query('limit') limit: string = '10',
    @Query('lastKey') lastKey?: string,
    @Query('status') status?: string,
  ): Promise<any> {
    const limitNumber = parseInt(limit, 10);
    const lastEvaluatedKey = lastKey ? JSON.parse(Buffer.from(lastKey, 'base64').toString()) : undefined;
    
    const result = await this.companyService.findAll(limitNumber, lastEvaluatedKey, status);
    
    return {
      ...result,
      nextKey: result.lastEvaluatedKey ? 
        Buffer.from(JSON.stringify(result.lastEvaluatedKey)).toString('base64') : 
        undefined,
    };
  }

  @Get(':id')
  @ApiCrudOperation('findOne', 'Company')
  @ApiParam({ name: 'id', description: 'Company UUID' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.companyService.findOne(id);
  }

  @Get('identification/:identification')
  @ApiFindByIdentification('company')
  @ApiParam({ name: 'identification', description: 'Company identification number' })
  async findByIdentification(@Param('identification') identification: string): Promise<any> {
    return this.companyService.findByIdentification(identification);
  }

  @Put(':id')
  @ApiCrudOperation('update', 'Company')
  @ApiParam({ name: 'id', description: 'Company UUID' })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<any> {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiCrudOperation('delete', 'Company')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.companyService.softDelete(id);
  }

  @Patch(':id/restore')
  @ApiCrudOperation('restore', 'Company')
  @ApiParam({ name: 'id', description: 'Company UUID' })
  async restore(@Param('id') id: string): Promise<any> {
    return this.companyService.restore(id);
  }
}