import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
// import { clear } from 'jest-date-mock';
import { ValidationPipe } from '@nestjs/common';
import { LinkCoreModule } from '../../src/link/core/link-core.module';
import {
  closeInMemoryMongoServer,
  rootMongooseTestModule,
} from './mongo-in-memory-server';
import { Model } from 'mongoose';
import { LinkEntity } from '../../src/link/core/entities/link.entity';
import { LinkUtils } from './link-utils';
import { UserCoreModule } from 'src/user/core/user-core.module';
import { RelayModule } from 'src/relay/relay.module';
import { AuthCoreModule } from 'src/auth/core/auth-core.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEntity } from 'src/user/core/entities/user.entity';
import { ApiKeyCoreModule } from 'src/api-key/core/api-key-core.module';
import { GeneralUtils } from './general-utils';
import { LinkVisitCoreModule } from 'src/link-visit/core/link-visit-core.module';
import { CacheModule } from '@nestjs/cache-manager';
import { EmailConfirmationService } from 'src/auth/traditonal/email-confirmation.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { MailerMock } from './mailer-mock';

export async function createTestApp() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      rootMongooseTestModule(),
      EventEmitterModule.forRoot(),
      CacheModule.register({ ttl: 600000, isGlobal: true }),
      MailerModule.forRoot({
        transport: {
          host: 'localhost',
          port: 1025,
        },
      }),
      LinkCoreModule,
      UserCoreModule,
      RelayModule,
      AuthCoreModule,
      ApiKeyCoreModule,
      LinkVisitCoreModule,
    ],
  })
    .overrideProvider(MailerService)
    .useClass(MailerMock)
    .compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.init();

  const linkModel: Model<LinkEntity> = module.get(
    getModelToken(LinkEntity.name),
  );

  const userModel: Model<UserEntity> = module.get(
    getModelToken(UserEntity.name),
  );

  const clearDatabase = async () => {
    await Promise.all([linkModel.deleteMany({}), userModel.deleteMany({})]);
  };

  const beforeEach = async () => {
    // clear();
    await clearDatabase();
  };

  const afterAll = async () => {
    await app.close();
    await closeInMemoryMongoServer();
    // clear();
  };

  return {
    app,
    module,
    mocks: {
      mailerService: module.get<MailerService>(MailerService),
    },
    models: {
      linkModel,
    },
    utils: {
      linkUtils: new LinkUtils(app),
      generalUtils: new GeneralUtils(app),
    },
    methods: {
      clearDatabase,
      beforeEach,
      afterAll,
    },
  };
}
