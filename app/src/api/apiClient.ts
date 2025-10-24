const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface FetchOptions extends RequestInit {
  body?: any;
}

export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Błąd: ${response.status}`);
  }

  return data;
};
