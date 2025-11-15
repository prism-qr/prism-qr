export class UpdateLinkDto {
  linkId: string;
  destination: string;
}

export interface UpdateLinkParams {
  destination?: string;
}
