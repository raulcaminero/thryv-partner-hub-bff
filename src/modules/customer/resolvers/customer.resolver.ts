// ...new file...
import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto, UpdateCustomerDto, CustomerGql } from '../dto/customer.dto';
import { JwtAuthGuard } from '../../../common/auth/guards/jwt-auth.guard';

@Resolver('Customer')
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [CustomerGql])
  @UseGuards(JwtAuthGuard)
  async customers(
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    @Args('status', { type: () => String, nullable: true }) status?: string,
  ) {
    const res = await this.customerService.findAll(page, limit, status);
    return res?.customers || res;
  }

  @Query(() => [CustomerGql])
  @UseGuards(JwtAuthGuard)
  async customer(@Args('id', { type: () => String }) id: string) {
    return this.customerService.findOne(id);
  }

  @Mutation(() => CustomerGql)
  @UseGuards(JwtAuthGuard)
  async createCustomer(@Args('input') input: CreateCustomerDto) {
    return this.customerService.create(input);
  }

  @Mutation(() => CustomerGql)
  @UseGuards(JwtAuthGuard)
  async updateCustomer(@Args('id') id: string, @Args('input') input: UpdateCustomerDto) {
    return this.customerService.update(id, input);
  }

  // add delete/restore mutations as needed
}