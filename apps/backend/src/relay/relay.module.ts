import { Module } from '@nestjs/common';
import { LinkCoreModule } from 'src/link/core/link-core.module';
import { RelayController } from './relay.controller';
import { LinkVisitCoreModule } from 'src/link-visit/core/link-visit-core.module';

@Module({
  imports: [LinkCoreModule, LinkVisitCoreModule],
  controllers: [RelayController],
})
export class RelayModule {}
