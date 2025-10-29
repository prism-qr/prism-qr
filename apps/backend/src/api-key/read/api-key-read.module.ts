import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeyEntity, ApiKeySchema } from '../core/entities/api-key.entity';
import { ApiKeyReadService } from './api-key-read.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApiKeyEntity.name, schema: ApiKeySchema },
    ]),
  ],
  providers: [ApiKeyReadService],
  exports: [ApiKeyReadService],
})
export class ApiKeyReadModule {}
