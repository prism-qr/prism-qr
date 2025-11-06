import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkEntity, LinkSchema } from '../core/entities/link.entity';
import { LinkWriteService } from './link-write.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LinkEntity.name, schema: LinkSchema }]),
    CacheModule.register({ ttl: 60000 }),
  ],
  providers: [LinkWriteService],
  exports: [LinkWriteService],
})
export class LinkWriteModule {}
