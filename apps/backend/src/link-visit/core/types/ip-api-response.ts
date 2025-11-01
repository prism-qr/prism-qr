export type IpApiResponse = {
  status: string;
  message: string;
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lon: number;
  timezone: string;
};