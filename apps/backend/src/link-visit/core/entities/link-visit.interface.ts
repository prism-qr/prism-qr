import { IpApiResponse } from "../types/ip-api-response";

export interface ILinkVisit {
  id: string;
  linkId: string;
  referrer?: string;
  ip?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  lat?: number;
  lon?: number;
  createdAt: Date;
}
