import { apiRequest } from "../api";

export interface User {
  email: string;
  authMethod: string;
  tier: string;
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/users/me", {
    method: "GET",
  });
}
