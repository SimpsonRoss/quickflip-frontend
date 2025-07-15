// lib/api.ts
// Switch between local and production backend
const USE_LOCAL_BACKEND = false; // Set to true for local development

const BASE_URL = USE_LOCAL_BACKEND
  ? "http://192.168.4.25:3000/api" // Local backend
  : "https://quickflip-backend-ross-simpsons-projects.vercel.app/api"; // Production backend

export interface User {
  id: string;
  email: string;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  userId: string;
  title: string;
  description: string;
  condition: string;
  genre: string;
  estimatedPrice: number | null;
  priceCount: number;
  totalAvailable?: number; // New field for 50+ feature
  imageUrl: string;
  status: string;
  pricePaid: number | null;
  priceSold: number | null;
  createdAt: string;
  updatedAt: string;
  purchasedAt: string | null;
  soldAt: string | null;
}

export interface DescribeImageResponse {
  id: string;
  title: string;
  description: string;
  condition: string;
  genre: string;
  estimatedPrice: number | null;
  priceCount: number;
  totalAvailable?: number; // Add this field for 50+ feature
  imageUrl: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // User Management
  async createOrGetUser(
    email: string,
    fullName?: string
  ): Promise<{ user: User }> {
    return this.request<{ user: User }>("/users", {
      method: "POST",
      body: JSON.stringify({ email, fullName }),
    });
  }

  // Product Management
  async getProducts(userId: string): Promise<{ products: Product[] }> {
    return this.request<{ products: Product[] }>(`/products?userId=${userId}`);
  }

  async describeImage(
    base64: string,
    userId: string
  ): Promise<DescribeImageResponse> {
    return this.request<DescribeImageResponse>("/describe", {
      method: "POST",
      body: JSON.stringify({ base64, userId }),
    });
  }

  async updateProductStatus(
    productId: string,
    status: "PURCHASED" | "SOLD",
    price?: number
  ): Promise<{ product: Product }> {
    const body: any = { status };
    if (status === "PURCHASED" && price !== undefined) {
      body.pricePaid = price;
    }
    if (status === "SOLD" && price !== undefined) {
      body.priceSold = price;
    }

    return this.request<{ product: Product }>(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async updateProduct(
    productId: string,
    updates: Partial<
      Pick<
        Product,
        | "title"
        | "description"
        | "condition"
        | "estimatedPrice"
        | "pricePaid"
        | "priceSold"
      >
    >
  ): Promise<{ product: Product }> {
    return this.request<{ product: Product }>(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(productId: string): Promise<void> {
    return this.request<void>(`/products/${productId}`, {
      method: "DELETE",
    });
  }
}

export const api = new ApiService();
