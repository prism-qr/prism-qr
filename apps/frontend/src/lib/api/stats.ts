import { apiRequest } from "../api";

interface TotalScansResponse {
  totalScans: number;
}

export async function getTotalScans(): Promise<number> {
  const response = await apiRequest<TotalScansResponse>("/link-visits/total");
  return response.totalScans;
}
