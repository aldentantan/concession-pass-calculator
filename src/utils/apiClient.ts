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

  private async parseResponseBody(response: Response): Promise<any> {
    const rawBody = await response.text();
    if (!rawBody) {
      return null;
    }

    try {
      return JSON.parse(rawBody);
    } catch {
      throw new Error(
        "The server returned an unexpected response. Please try again shortly."
      );
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof TypeError) {
      return new Error("Network error or server is unreachable");
    }
    if (error instanceof Error) {
      return new Error(error.message || "Request failed. Try again later.");
    }
    return new Error("Request failed. Try again later.");
  }

  async get(endpoint: string, params?: Record<string, any>): Promise<any> {
    try {
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
      const data = await this.parseResponseBody(response);

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Request failed");
      }
      return data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async post(endpoint: string, body: any): Promise<any> {
    try {
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

      const data = await this.parseResponseBody(res);

      if (!res.ok) {
        throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
      }
      return data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async delete(endpoint: string, params?: Record<string, any>): Promise<any> {
    try {
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
        method: "DELETE",
        headers: authHeader,
      });
      const data = await this.parseResponseBody(response);
      if (!response.ok) {
        throw new Error(data?.message || data?.error || "Request failed");
      }
      return data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
