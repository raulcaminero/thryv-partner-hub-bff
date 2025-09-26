import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from './common/common.module';
import { AuthModule } from './common/auth/auth.module';
import { AuthTokenModule } from './modules/auth-token/auth-token.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthResolver } from './health.resolver';
import { CustomerModule } from './modules/customer/customer.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { Request } from 'express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.development', '.env.staging', '.env.production', '.env'],
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) =>
        ({
          ttl: parseInt(cfg.get<string>('RATE_LIMIT_TTL') || '60', 10),
          limit: parseInt(cfg.get<string>('RATE_LIMIT_LIMIT') || '100', 10),
        } as any),
    }),

    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        baseURL: cfg.get<string>('REMOTE_BACKEND_URL') || cfg.get<string>('REMOTE_API_URL'),
        timeout: parseInt(cfg.get<string>('REMOTE_HTTP_TIMEOUT') || '10000', 10),
        maxRedirects: 5,
      }),
    }),

    // Use ApolloDriver explicitly (required by @nestjs/graphql v10+)
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      path: '/graphql',
      context: ({ req }: { req?: Request }) => ({ headers: req?.headers }),
    }),

    // Application modules
    CommonModule,
    AuthModule,
    AuthTokenModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService, HealthResolver],
})
export class AppModule {}