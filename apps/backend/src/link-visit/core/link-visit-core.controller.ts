import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/core/decorators/is-public.decorator';
import { LinkVisitReadService } from '../read/link-visit-read.service';

@Public()
@Controller('link-visits')
export class LinkVisitCoreController {
  constructor(private readonly readService: LinkVisitReadService) {}

  @Get('total')
  public async getTotalScans(): Promise<{ totalScans: number }> {
    return {
      totalScans: await this.readService.getTotalScans(),
    };
  }
}
