import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CompanyController } from './controllers/company.controller';
import { CompanyService } from './services/company.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}