import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}