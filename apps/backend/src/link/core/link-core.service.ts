import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { LinkReadService } from 'src/link/read/link-read.service';
import { getEnvConfig } from 'src/shared/config/env-configs';
import { ILink } from './entities/link.interface';

@Injectable()
export class LinkCoreService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly linkReadService: LinkReadService,
  ) {}

  isValidUrl(url: any): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  async getTargetUrl(name: string) {
    const cacheKey = `link:${name}`;

    const linkJson = (await this.cacheManager.get(cacheKey)) as string;
    if (linkJson) {
      console.log('cache match!');
      const parsed = JSON.parse(linkJson) as ILink;
      return this.linkToUrl(parsed);
    }
    const link = await this.linkReadService.readByName(name);

    await this.cacheManager.set(cacheKey, JSON.stringify(link));

    return this.linkToUrl(link);
  }

  linkToUrl(link?: ILink | null) {
    return this.isValidUrl(link?.destination)
      ? link?.destination
      : getEnvConfig().internal.backendUrl;
  }
}
