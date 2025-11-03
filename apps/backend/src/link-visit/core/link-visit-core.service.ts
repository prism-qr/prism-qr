import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { LinkVisitWriteService } from '../write/link-visit-write.service';
import { IpApiResponse } from './types/ip-api-response';
import { CreateLinkVisitParams } from './types/create-link-visit-params';

@Injectable()
export class LinkVisitCoreService {
  private readonly logger = new Logger(LinkVisitCoreService.name);

  constructor(private readonly linkVisitWriteService: LinkVisitWriteService) {}

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
    const cloudflareIp = req.headers['cf-connecting-ip'];
    if (cloudflareIp) {
      return Array.isArray(cloudflareIp) ? cloudflareIp[0] : cloudflareIp;
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
      return ips.split(',')[0].trim();
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

  async logVisitDetails(linkId: string, req: Request): Promise<void> {
    const languageHeader = this.tryGetLanguageHeaderFromRequest(req);
    const referrer = this.tryGetReferrerFromRequest(req);

    const ip = this.tryGetIpFromRequest(req);
    const geoLocation = await this.tryGetGeoLocationFromIp(ip);

    const params: CreateLinkVisitParams = {
      linkId: linkId,
      referrer: referrer,
      languageHeader: languageHeader,
      ip: ip,
      country: geoLocation?.country,
      countryCode: geoLocation?.countryCode,
      city: geoLocation?.city,
      lat: geoLocation?.lat,
      lon: geoLocation?.lon,
    };

    this.logger.log(`${JSON.stringify(params)}`);
    // TODO uncoment to collect logs
    // await this.linkVisitWriteService.create(params);
  }
}
