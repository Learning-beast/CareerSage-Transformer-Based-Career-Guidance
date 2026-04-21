const API_BASE = "http://localhost:3001";

function getAuthHeaders(): Headers {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
}

export async function apiGet(endpoint: string) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Request failed");
  }

  return response.json();
}

export async function apiPost(endpoint: string, body: any) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Request failed");
  }

  return response.json();
}