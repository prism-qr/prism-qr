import { Module } from '@nestjs/common';
// import { ApiKeyAuthController } from './api-key-auth.controller';
import { ApiKeyAuthService } from './api-key-auth.service';
import { ApiKeyReadModule } from '../../api-key/read/api-key-read.module';
// import { ProjectReadModule } from '../../project/read/project-read.module';
import { CustomJwtModule } from '../custom-jwt/custom-jwt.module';

@Module({
  imports: [ApiKeyReadModule, CustomJwtModule],
  providers: [ApiKeyAuthService],
  exports: [ApiKeyAuthService],
})
export class ApiKeyAuthModule {}
