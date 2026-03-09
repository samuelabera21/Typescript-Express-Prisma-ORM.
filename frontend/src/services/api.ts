const API_BASE_URL = "http://localhost:5000";

async function parseApiError(response: Response) {
  try {
    const error = await response.json();
    return error.message || "API request failed";
  } catch {
    return "API request failed";
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const canAttemptRefresh = ![
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
    "/auth/verify-email",
    "/auth/resend-verification",
  ].includes(path);

  const headers = new Headers(options.headers);

  const hasBody = options.body !== undefined;

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,

    credentials: "include",
    headers,
  });

  if (response.status === 401 && canAttemptRefresh) {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers,
      });
    }
  }

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}