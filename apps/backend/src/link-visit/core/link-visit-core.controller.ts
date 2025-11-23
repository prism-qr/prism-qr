import { Controller, Get, Param } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/auth/core/decorators/is-public.decorator';
import { LinkVisitReadService } from '../read/link-visit-read.service';

@Public()
@Controller('link-visits')
export class LinkVisitCoreController {
  constructor(private readonly readService: LinkVisitReadService) {}

  @SkipThrottle({ heavy: true })
  @Get('total')
  public async getTotalScans(): Promise<{ totalScans: number }> {
    return {
      totalScans: await this.readService.getTotalScans(),
    };
  }

  @Get(':linkName')
  public async getLinksScans(
    @Param('linkName') linkName: string,
  ): Promise<number> {
    return this.readService.getLinksScans(linkName);
  }
}
