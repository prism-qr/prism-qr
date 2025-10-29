import { Module } from '@nestjs/common';
import { LinkReadModule } from 'src/link/read/link-read.module';
import { LinkWriteModule } from 'src/link/write/link-write.module';
import { LinkCoreController } from './link-core.controller';
import { LinkCoreService } from './link-core.service';
import { UserReadModule } from 'src/user/read/user-read.module';
import { ApiKeyAuthModule } from 'src/auth/api-key/api-key-auth.module';
import { AuthCoreModule } from 'src/auth/core/auth-core.module';

@Module({
  imports: [
    LinkReadModule,
    LinkWriteModule,
    UserReadModule,
    ApiKeyAuthModule,
    AuthCoreModule,
  ],

  controllers: [LinkCoreController],
  providers: [LinkCoreService],
  exports: [LinkCoreService],
})
export class LinkCoreModule {}
