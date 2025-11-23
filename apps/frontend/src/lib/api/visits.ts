import { apiRequest } from "../api";

export async function getLinkVisits(linkId: string): Promise<number> {
  return apiRequest<number>(`/link-visits/${linkId}`);
}

