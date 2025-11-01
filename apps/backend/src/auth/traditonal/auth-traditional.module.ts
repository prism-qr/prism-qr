import { Module } from '@nestjs/common';
import { AuthTraditionalService } from './auth-traditional.service';
import { UserWriteModule } from '../../user/write/user-write.module';
import { AuthTraditionalController } from './auth-traditional.controller';
import { UserReadModule } from '../../user/read/user-read.module';
import { CustomJwtModule } from '../custom-jwt/custom-jwt.module';

@Module({
  imports: [UserReadModule, UserWriteModule, CustomJwtModule],
  controllers: [AuthTraditionalController],
  providers: [AuthTraditionalService],
})
export class AuthTraditionalModule {}
