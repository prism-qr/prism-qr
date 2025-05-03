import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LinkReadService } from 'src/link/read/link-read.service';

@Injectable()
export class LinkCoreService {
  constructor(
    private readonly linkReadService: LinkReadService,
    private readonly configService: ConfigService,
  ) {}

  isValidUrl(url: string): boolean {
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
    return this.isValidUrl(link.destination)
      ? link.destination
      : this.configService.get<string>('BACKEND_URL');
  }
}
