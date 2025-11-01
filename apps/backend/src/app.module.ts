import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkCoreModule } from './link/core/link-core.module';
import { UserCoreModule } from './user/core/user-core.module';
import { getEnvConfig } from './shared/config/env-configs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthCoreModule } from './auth/core/auth-core.module';
import { RelayModule } from './relay/relay.module';
import { ApiKeyCoreModule } from './api-key/core/api-key-core.module';
import { HealthModule } from './health/health.module';
import { LinkVisitCoreModule } from './link-visit/core/link-visit-core.module';

@Module({
  imports: [
    MongooseModule.forRoot(getEnvConfig().mongo.uri, { dbName: 'default' }),
    EventEmitterModule.forRoot(),
    LinkCoreModule,
    LinkVisitCoreModule,
    AuthCoreModule,
    UserCoreModule,
    RelayModule,
    ApiKeyCoreModule,
    HealthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
