import { Module } from '@nestjs/common';
import { LinkReadService } from './link-read.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkEntity, LinkSchema } from '../core/entities/link.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LinkEntity.name, schema: LinkSchema }]),
  ],
  providers: [LinkReadService],
  exports: [LinkReadService],
})
export class LinkReadModule {}
