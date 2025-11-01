import { Controller, Get, Logger, Param, Redirect, Req } from '@nestjs/common';
import { Public } from 'src/auth/core/decorators/is-public.decorator';
import { LinkVisitCoreService } from 'src/link-visit/core/link-visit-core.service';
import { LinkCoreService } from 'src/link/core/link-core.service';
import { getEnvConfig } from 'src/shared/config/env-configs';

@Controller()
export class RelayController {
  private readonly logger = new Logger(RelayController.name);
  constructor(
    private readonly linkCoreService: LinkCoreService,
    private readonly linkVisitCoreService: LinkVisitCoreService,
  ) {}

  @Public()
  @Get(':name')
  @Redirect()
  async redirect(@Req() req: Request, @Param('name') name: string) {
    const startTime = Date.now();

    this.logger.log(
      `Redirect requested for ${getEnvConfig().internal.frontendUrl}/${name}`,
    );
    await this.linkVisitCoreService.logVisitDetails(name, req);
    const targetUrl = await this.linkCoreService.getTargetUrl(name);
    this.logger.log(`Redirecting to ${targetUrl}`);
    const endTime = Date.now();
    this.logger.log(`Redirect time: ${endTime - startTime}ms`);
    return { url: targetUrl };
  }
}
