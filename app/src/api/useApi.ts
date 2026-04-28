import { useAuth } from "@clerk/clerk-react";
import { apiFetch } from "./apiClient"; // sprawdź czy ścieżka się zgadza

export const useApi = () => {
  const { getToken } = useAuth();

  // Tworzymy "opakowaną" wersję Twojej funkcji
  const api = async (endpoint: string, options: any = {}) => {
    const token = await getToken(); // Sam wyciąga token z Clerka
    return apiFetch(endpoint, options, token); // Podaje go do Twojej bazy
  };

  return { api };
};