import { apiRequest } from "../api";

export async function getLinkVisits(linkName: string): Promise<number> {
  return apiRequest<number>(`/link-visits/${linkName}`);
}
