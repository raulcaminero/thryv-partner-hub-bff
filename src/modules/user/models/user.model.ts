import { Resolver, Query, Args } from '@nestjs/graphql';
import { ObjectType, Field, ID } from '@nestjs/graphql';

// Lightweight GraphQL types for testing
@ObjectType()
export class UserGql {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  email: string;
}

@ObjectType()
export class PostGql {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  userId: number;
}