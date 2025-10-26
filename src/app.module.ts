import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkCoreModule } from './link/core/link-core.module';
import { UserCoreModule } from './user/core/user-core.module';
import { getEnvConfig } from './shared/config/env-configs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthCoreModule } from './auth/core/auth-core.module';

@Module({
  imports: [
    MongooseModule.forRoot(getEnvConfig().mongo.uri, { dbName: 'default' }),
    EventEmitterModule.forRoot(),
    LinkCoreModule,
    AuthCoreModule,
    UserCoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
