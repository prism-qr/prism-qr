export interface ILinkVisit {
  id: string;
  linkName: string;
  referrer?: string;
  ip?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  lat?: number;
  lon?: number;
  createdAt: Date;
}
