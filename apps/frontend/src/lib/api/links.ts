import { apiRequest } from "../api";

export interface Link {
  id: string;
  userId: string;
  name: string;
  destination: string;
}

export interface ApiKey {
  id: string;
  prefix: string;
  linkId: string;
  createdAt?: string;
  updatedAt?: string;
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

export async function deleteLink(
  linkId: string
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/links/${linkId}`, {
    method: "DELETE",
  });
}

export async function getApiKey(linkId: string): Promise<{ apiKey: string }> {
  return apiRequest<{ apiKey: string }>(`/links/${linkId}/api_key`);
}

export async function listApiKeys(linkId: string): Promise<ApiKey[]> {
  return apiRequest<ApiKey[]>(`/links/${linkId}/api_keys`);
}

export async function deleteApiKey(
  linkId: string,
  keyId: string
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(
    `/links/${linkId}/api_keys/${keyId}`,
    {
      method: "DELETE",
    }
  );
}
