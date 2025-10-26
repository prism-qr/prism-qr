import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { CustomJwtModule } from '../custom-jwt/custom-jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthEventModule } from '../events/auth-event.module';
import { GoogleAuthModule } from '../google/google-auth.module';
import { AuthTraditionalModule } from '../traditonal/auth-traditional.module';

@Module({
  imports: [
    GoogleAuthModule,
    CustomJwtModule,
    AuthEventModule,
    AuthTraditionalModule,
  ],
  providers: [AuthGuard, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthCoreModule {}
