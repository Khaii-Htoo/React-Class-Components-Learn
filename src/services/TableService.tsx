// services/TableService.ts
import { BaseService, type ApiResponse } from "./BaseService";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface TableQueryParams {
  limit?: number;
  skip?: number;
  q?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export class TableService extends BaseService {
  // Get products with pagination, search, and sorting
  async getProducts(
    params: TableQueryParams = {}
  ): Promise<ApiResponse<ProductsResponse>> {
    const { limit = 10, skip = 0, q = "", sortBy = "", order = "asc" } = params;

    let endpoint = "/products";

    if (q) {
      endpoint = "/products/search";
    }

    const queryParams = this.buildQueryParams({
      limit,
      skip,
      q,
      sortBy,
      order,
    });

    return this.request<ProductsResponse>(`${endpoint}?${queryParams}`);
  }

  // Get all categories
  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>("/products/categories");
  }

  // Get products by category
  async getProductsByCategory(
    category: string,
    params: Omit<TableQueryParams, "q"> = {}
  ): Promise<ApiResponse<ProductsResponse>> {
    const queryParams = this.buildQueryParams(params);
    return this.request<ProductsResponse>(
      `/products/category/${category}?${queryParams}`
    );
  }

  // Get single product
  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }
}
