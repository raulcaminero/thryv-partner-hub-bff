import { Resolver, Query, Args } from '@nestjs/graphql';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { UserGql, PostGql } from '../models/user.model';

@Resolver()
export class UserResolver {
  constructor(private readonly svc: UserService) {}

  // GET /users
  @Query(() => [UserGql], { name: 'testUsers' })
  async testUsers() {
    return this.svc.getUsers();
  }

  // GET /users/:id
  @Query(() => UserGql, { name: 'testUser', nullable: true })
  async testUser(@Args('id') id: string) {
    return this.svc.getUser(id);
  }

  // GET /posts
  @Query(() => [PostGql], { name: 'testPosts' })
  async testPosts() {
    return this.svc.getPosts();
  }

  // GET /posts?userId=
  @Query(() => [PostGql], { name: 'testPostsByUser' })
  async testPostsByUser(@Args('userId') userId: string) {
    return this.svc.getPostsByUser(userId);
  }
}