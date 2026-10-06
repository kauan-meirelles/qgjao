// frontend/src/lib/api.ts
const API_URL = "http://localhost:8000/api";

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Essencial para enviar o cookie de sessão!
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw errorData;
  }

  return res.json();
}

export async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Essencial para enviar o cookie de sessão!
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw errorData;
  }

  return res.json();
}

export async function apiPatch<T>(endpoint: string, data?: any): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Essencial para enviar o cookie de sessão!
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw errorData;
  }

  return res.json();
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Essencial para enviar o cookie de sessão!
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw errorData;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}