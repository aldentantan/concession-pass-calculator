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

  async get(endpoint: string, params?: Record<string, any>): Promise<any> {
    const authHeader = await this.getAuthHeader();

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      headers: authHeader,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
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

  async delete(endpoint: string, params?: Record<string, any>): Promise<any> {
    const authHeader = await this.getAuthHeader();

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    console.log("DELETE URL:", url);
    const response = await fetch(url, {
      method: "DELETE",
      headers: authHeader,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
