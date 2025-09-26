import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { CustomerResolver } from './resolvers/customer.resolver';

@Module({
   imports: [ConfigModule, HttpModule],
   controllers: [CustomerController],
   providers: [CustomerService, CustomerResolver],
   exports: [CustomerService],
 })
 export class CustomerModule {}