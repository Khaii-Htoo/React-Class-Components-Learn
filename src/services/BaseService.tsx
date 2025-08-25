// services/BaseService.ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  total?: number;
  skip?: number;
  limit?: number;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class BaseService {
  private baseURL: string = "https://dummyjson.com";

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data,
        success: true,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      };
    } catch (error) {
      console.error("API Request failed:", error);
      throw {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        status: 0,
        code: "NETWORK_ERROR",
      } as ApiError;
    }
  }

  protected buildQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    return searchParams.toString();
  }
}

class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}
