import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkVisitEntity, LinkVisitSchema } from '../core/entities/link-visit.entity';
import { LinkVisitWriteService } from './link-visit-write.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LinkVisitEntity.name, schema: LinkVisitSchema }]),
  ],
  providers: [LinkVisitWriteService],
  exports: [LinkVisitWriteService],
})
export class LinkVisitWriteModule {}
