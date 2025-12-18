const API_BASE_URL = ""; 

interface FetchOptions extends RequestInit {
  body?: any;
}

export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  // Dodajemy obsługę slashy, aby uniknąć np. //auth/login
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  // Dodajemy credentials: "include", jeśli używasz sesji/cookie
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: options.credentials || "include", 
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // Obsługa pustych odpowiedzi (np. status 204)
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Błąd: ${response.status}`);
  }

  return data;
};