import { Resolver, Query } from '@nestjs/graphql';
import { ObjectType, Field } from '@nestjs/graphql';
import { AppService } from './app.service';

@ObjectType()
class HealthGql {
  @Field() status: string;
  @Field() timestamp: string;
  @Field() service: string;
}

@Resolver()
export class HealthResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => HealthGql, { name: 'health' })
  health() {
    return this.appService.getHealth();
  }
}