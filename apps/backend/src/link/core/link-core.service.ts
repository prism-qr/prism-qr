import { Injectable } from '@nestjs/common';
import { LinkReadService } from 'src/link/read/link-read.service';
import { getEnvConfig } from 'src/shared/config/env-configs';

@Injectable()
export class LinkCoreService {
  constructor(private readonly linkReadService: LinkReadService) {}

  isValidUrl(url: any): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async getTargetUrl(name: string) {
    // TODO extends logic
    const link = await this.linkReadService.readByName(name);

    return this.isValidUrl(link?.destination)
      ? link?.destination
      : getEnvConfig().internal.backendUrl;
  }
}
