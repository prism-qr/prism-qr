import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { Public } from 'src/auth/core/decorators/is-public.decorator';
import { LinkCoreService } from 'src/link/core/link-core.service';

@Controller()
export class RelayController {
  constructor(private readonly linkCoreService: LinkCoreService) {}

  @Public()
  @Get(':name')
  @Redirect()
  async redirect(@Param('name') name: string) {
    const targetUrl = await this.linkCoreService.getTargetUrl(name);
    return { url: targetUrl };
  }
}
