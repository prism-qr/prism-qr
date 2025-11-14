import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LinkVisitEntity,
  LinkVisitSchema,
} from '../core/entities/link-visit.entity';
import { LinkVisitWriteService } from './link-visit-write.service';
import { LinkVisitBatchBufferService } from './link-visit-batch-buffer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LinkVisitEntity.name, schema: LinkVisitSchema },
    ]),
  ],
  providers: [LinkVisitWriteService, LinkVisitBatchBufferService],
  exports: [LinkVisitWriteService, LinkVisitBatchBufferService],
})
export class LinkVisitWriteModule {}
