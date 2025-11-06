import { Module } from '@nestjs/common';
import { LinkVisitCoreService } from './link-visit-core.service';
import { LinkVisitWriteModule } from '../write/link-visit-write.module';
import { LinkVisitReadModule } from '../read/link-visit-read.module';

@Module({
  imports: [LinkVisitWriteModule, LinkVisitReadModule],
  providers: [LinkVisitCoreService],
  exports: [LinkVisitCoreService],
})
export class LinkVisitCoreModule {}
