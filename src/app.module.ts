import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from './common/common.module';
import { AuthModule } from './common/auth/auth.module';
import { AuthTokenModule } from './modules/auth-token/auth-token.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.development', '.env.staging', '.env.production', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot({
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
      limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100', 10),
    }),

    // HTTP client to proxy requests to other backends
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        baseURL: cfg.get<string>('REMOTE_BACKEND_URL') || cfg.get<string>('REMOTE_API_URL'),
        timeout: parseInt(cfg.get<string>('REMOTE_HTTP_TIMEOUT') || '10000', 10),
        maxRedirects: 5,
      }),
    }),

    // Application modules
    CommonModule,
    AuthModule,
    AuthTokenModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
