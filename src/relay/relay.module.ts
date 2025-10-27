import { Module } from '@nestjs/common';
import { LinkCoreModule } from 'src/link/core/link-core.module';
import { RelayController } from './relay.controller';

@Module({
  imports: [LinkCoreModule],
  controllers: [RelayController],
})
export class RelayModule {}
