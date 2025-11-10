import { apiRequest } from "../api";

export interface Link {
  id: string;
  userId: string;
  name: string;
  destination: string;
}

export function generateRandomLinkName(length: number = 5): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function getLinks(): Promise<Link[]> {
  return apiRequest<Link[]>("/links");
}

export async function createLink(
  name: string,
  destination: string
): Promise<Link> {
  return apiRequest<Link>("/links", {
    method: "POST",
    body: JSON.stringify({ name, destination }),
  });
}

export async function updateLink(
  linkId: string,
  destination: string
): Promise<Link> {
  return apiRequest<Link>(`/links/${linkId}`, {
    method: "PATCH",
    body: JSON.stringify({ destination }),
  });
}

export async function getApiKey(linkId: string): Promise<{ apiKey: string }> {
  return apiRequest<{ apiKey: string }>(`/links/${linkId}/api_key`);
}
