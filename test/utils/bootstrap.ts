import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { clear } from 'jest-date-mock';
import { ValidationPipe } from '@nestjs/common';
import { LinkCoreModule } from '../../src/link/core/link-core.module';
import {
  closeInMemoryMongoServer,
  rootMongooseTestModule,
} from './mongo-in-memory-server';
import { Model } from 'mongoose';
import { LinkEntity } from '../../src/link/core/entities/link.entity';
import { LinkUtils } from './link-utils';

export async function createTestApp() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [rootMongooseTestModule(), LinkCoreModule],
  }).compile();

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

  const clearDatabase = async () => {
    await Promise.all([linkModel.deleteMany({})]);
  };

  const beforeEach = async () => {
    clear();
    await clearDatabase();
  };

  const afterAll = async () => {
    await app.close();
    await closeInMemoryMongoServer();
    clear();
  };

  return {
    app,
    module,
    models: {
      linkModel,
    },
    utils: {
      linkUtils: new LinkUtils(app),
    },
    methods: {
      clearDatabase,
      beforeEach,
      afterAll,
    },
  };
}
