const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface FetchOptions extends RequestInit {
  body?: any;
}

// Dodajemy trzeci parametr: token
export const apiFetch = async (endpoint: string, options: FetchOptions = {}, token?: string | null) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {})
  };

  // UŻYWAMY TOKENA PRZEKAZANEGO Z CLERKA
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: options.credentials || "include",
    body: isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // 401 zazwyczaj oznacza wygasły token lub brak autoryzacji
    throw new Error(data.message || `Błąd: ${response.status}`);
  }

  return data;
};