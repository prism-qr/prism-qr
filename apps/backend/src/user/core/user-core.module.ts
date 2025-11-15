import { Module } from '@nestjs/common';
import { UserReadModule } from '../read/user-read.module';
import { UserWriteModule } from '../write/user-write.module';
import { UserEventModule } from '../events/user-event.module';
import { CustomJwtModule } from '../../auth/custom-jwt/custom-jwt.module';
import { UserCoreEventController } from './user-core.event-controller';
import { UserCoreController } from './user-core.controller';

@Module({
  imports: [UserReadModule, UserWriteModule, UserEventModule, CustomJwtModule],
  providers: [UserCoreEventController],
  controllers: [UserCoreController],
})
export class UserCoreModule {}
