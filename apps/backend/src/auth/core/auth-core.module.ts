import { Module } from '@nestjs/common';
import { CustomJwtModule } from '../custom-jwt/custom-jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthEventModule } from '../events/auth-event.module';
import { GoogleAuthModule } from '../google/google-auth.module';
import { AuthTraditionalModule } from '../traditonal/auth-traditional.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiKeyAuthModule } from '../api-key/api-key-auth.module';
import { JwtOrApiKeyAuthGuard } from './guards/jwt-or-api-key-auth.guard';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';

@Module({
  imports: [
    GoogleAuthModule,
    CustomJwtModule,
    ApiKeyAuthModule,
    AuthEventModule,
    AuthTraditionalModule,
  ],
  providers: [
    JwtAuthGuard,
    ApiKeyAuthGuard,
    JwtOrApiKeyAuthGuard,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  exports: [JwtAuthGuard, ApiKeyAuthGuard, JwtOrApiKeyAuthGuard],
})
export class AuthCoreModule {}
