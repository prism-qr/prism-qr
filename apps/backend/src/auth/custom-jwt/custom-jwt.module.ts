import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CustomJwtService } from './custom-jwt.service';
import { getEnvConfig } from 'src/shared/config/env-configs';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: getEnvConfig().auth.jwtSecret,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [CustomJwtService],
  exports: [CustomJwtService],
})
export class CustomJwtModule {}
