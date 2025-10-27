import { Module } from '@nestjs/common';
import { ApiKeyCoreController } from './api-key-core.controller';
import { ApiKeyWriteModule } from '../write/api-key-write.module';
import { ApiKeyReadModule } from '../read/api-key-read.module';
import { UserReadModule } from 'src/user/read/user-read.module';
import { CustomJwtModule } from 'src/auth/custom-jwt/custom-jwt.module';

@Module({
  imports: [
    ApiKeyWriteModule,
    UserReadModule,
    ApiKeyReadModule,
    CustomJwtModule,
  ],
  controllers: [ApiKeyCoreController],
  providers: [],
})
export class ApiKeyCoreModule {}
