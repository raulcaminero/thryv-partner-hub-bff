import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';

@Module({
  imports: [HttpModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}