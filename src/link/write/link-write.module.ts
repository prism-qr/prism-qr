import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkEntity, LinkSchema } from '../core/entities/link.entity';
import { LinkWriteService } from './link-write.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LinkEntity.name, schema: LinkSchema }]),
  ],
  providers: [LinkWriteService],
  exports: [LinkWriteService],
})
export class LinkWriteModule {}
