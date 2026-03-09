import { apiFetch } from "./api";

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
};

export async function loginUser(data: LoginData) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerUser(data: RegisterData) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logoutUser() {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser() {
  return apiFetch("/user/profile");
}