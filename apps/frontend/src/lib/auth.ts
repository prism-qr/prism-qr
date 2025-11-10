import { apiRequest } from "./api";

export interface TokenResponse {
  token: string;
  isNewUser?: boolean;
}

export interface RegistrationResponse {
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface GoogleLoginPayload {
  googleCode: string;
  termsAccepted?: boolean;
  emailAccepted?: boolean;
  forceLocalLogin?: boolean;
}

export async function login(
  credentials: LoginCredentials
): Promise<TokenResponse> {
  return apiRequest<TokenResponse>("/auth/traditional/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function register(
  credentials: RegisterCredentials
): Promise<RegistrationResponse> {
  return apiRequest<RegistrationResponse>("/auth/traditional/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function loginWithGoogle(
  payload: GoogleLoginPayload
): Promise<TokenResponse> {
  return apiRequest<TokenResponse>("/auth/google/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}
