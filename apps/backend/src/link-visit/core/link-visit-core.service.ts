import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { LinkVisitBatchBufferService } from '../write/link-visit-batch-buffer.service';
import { IpApiResponse } from './types/ip-api-response';
import { CreateLinkVisitParams } from './types/create-link-visit-params';
import { OnEvent } from '@nestjs/event-emitter';
import { LinkEvents } from 'src/relay/events/link-events.enum';
import { LinkVisitedEvent } from 'src/relay/events/link-visited.event';

@Injectable()
export class LinkVisitCoreService {
  private readonly logger = new Logger(LinkVisitCoreService.name);

  constructor(
    private readonly batchBufferService: LinkVisitBatchBufferService,
  ) {}

  tryGetLanguageHeaderFromRequest(req: Request): string | undefined {
    const languageHeader = req.headers['accept-language'];
    if (!languageHeader) {
      return;
    }
    const languageHeaderStripped = languageHeader.split(',')[0];
    return languageHeaderStripped;
  }

  tryGetReferrerFromRequest(req: Request): string | undefined {
    const referrer = req.headers['referer'];
    if (!referrer) {
      return;
    }
    return referrer;
  }

  tryGetIpFromRequest(req: Request): string | undefined {
    const vercelIp = req.headers['x-vercel-forwarded-for'];
    if (vercelIp) {
      return Array.isArray(vercelIp) ? vercelIp[0] : vercelIp;
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
      return ips.split(',')[0].trim();
    }

    const cloudflareIp = req.headers['cf-connecting-ip'];
    if (cloudflareIp) {
      return Array.isArray(cloudflareIp) ? cloudflareIp[0] : cloudflareIp;
    }
  }

  async tryGetGeoLocationFromIp(
    ip: string | undefined,
  ): Promise<IpApiResponse | undefined> {
    if (!ip) {
      return;
    }

    try {
      const response = await axios.get<IpApiResponse>(
        `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,timezone`,
      );
      if (response.data.status !== 'success') {
        return;
      }
      return response.data;
    } catch (error) {
      this.logger.error(`Error getting geo location from ip: ${ip}`, error);
      return;
    }
  }

  @OnEvent(LinkEvents.LinkVisitedEvent)
  async logVisitDetails(payload: LinkVisitedEvent): Promise<void> {
    const languageHeader = this.tryGetLanguageHeaderFromRequest(payload.req);
    const referrer = this.tryGetReferrerFromRequest(payload.req);

    const ip = this.tryGetIpFromRequest(payload.req);
    const geoLocation = await this.tryGetGeoLocationFromIp(ip);

    const params: CreateLinkVisitParams = {
      linkName: payload.name,
      referrer: referrer,
      languageHeader: languageHeader,
      ip: ip,
      country: geoLocation?.country,
      countryCode: geoLocation?.countryCode,
      city: geoLocation?.city,
      lat: geoLocation?.lat,
      lon: geoLocation?.lon,
    };

    this.logger.log(`Buffering visit: ${JSON.stringify(params)}`);
    this.batchBufferService.addToBuffer(params);
  }
}
