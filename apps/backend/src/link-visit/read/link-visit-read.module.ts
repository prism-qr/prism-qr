import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkVisitEntity, LinkVisitSchema } from '../core/entities/link-visit.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LinkVisitEntity.name, schema: LinkVisitSchema }]),
  ],
})
export class LinkVisitReadModule {}
