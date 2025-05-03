import { Module } from '@nestjs/common';
import { LinkReadModule } from 'src/link/read/link-read.module';
import { LinkWriteModule } from 'src/link/write/link-write.module';
import { LinkCoreController } from './link-core.controller';
import { LinkCoreService } from './link-core.service';

@Module({
  imports: [LinkReadModule, LinkWriteModule],
  controllers: [LinkCoreController],
  providers: [LinkCoreService],
})
export class LinkCoreModule {}
