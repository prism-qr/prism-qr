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
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LogtailTransport } from '@logtail/winston';
import { Logtail } from '@logtail/node';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';

const logtail = new Logtail(process.env.BETTER_STACK_SOURCE_TOKEN!, {
  endpoint: process.env.BETTER_STACK_SOURCE_ENDPOINT!,
});

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        // Colored console logs for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message, context, ...meta }) => {
                return `${timestamp} [${context || 'Application'}] ${level}: ${message}`;
              },
            ),
          ),
        }),
        new LogtailTransport(logtail),
      ],
    }),
    MongooseModule.forRoot(getEnvConfig().mongo.uri, { dbName: 'default' }),
    CacheModule.register({ ttl: 600000, isGlobal: true }),
    EventEmitterModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.m231.mikr.dev',
        port: 587,
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
        requireTLS: true,
        auth: {
          user: getEnvConfig().mail.user,
          pass: getEnvConfig().mail.password,
        },
        logger: true,
        debug: true,
      },
      defaults: {
        from: '"Prism QR" <admin@prismqr.com>',
      },
    }),
    LinkCoreModule,
    LinkVisitCoreModule,
    AuthCoreModule,
    UserCoreModule,
    RelayModule,
    ApiKeyCoreModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
