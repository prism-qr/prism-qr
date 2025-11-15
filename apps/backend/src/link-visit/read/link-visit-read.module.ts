import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LinkVisitEntity,
  LinkVisitSchema,
} from '../core/entities/link-visit.entity';
import { LinkVisitReadService } from './link-visit-read.service';
import { LinkVisitCoreController } from '../core/link-visit-core.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LinkVisitEntity.name, schema: LinkVisitSchema },
    ]),
  ],
  providers: [LinkVisitReadService],
  controllers: [LinkVisitCoreController],
  exports: [LinkVisitReadService],
})
export class LinkVisitReadModule {}
