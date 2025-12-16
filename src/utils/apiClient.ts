import { supabase } from "../supabase";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  }

  private async getAuthHeader(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      return {
        Authorization: `Bearer ${session.access_token}`,
      };
    }

    return {};
  }

  async get(endpoint: string): Promise<any> {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: authHeader,
    });
    const data = await response.json();

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
    return data;
  }

  async post(endpoint: string, body: any): Promise<any> {
    const isFormData = body instanceof FormData;

    const authHeader = await this.getAuthHeader();
    const headers: Record<string, string> = { ...authHeader };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
