import type { Delivery, DeliveryInput } from '../app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL !== 'http://localhost:5000'
  ? process.env.NEXT_PUBLIC_API_URL
  : '';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
  }

  async getDeliveries(): Promise<Delivery[]> {
    return this.request('/api/deliveries');
  }

  async createDelivery(data: DeliveryInput): Promise<Delivery> {
    return this.request('/api/deliveries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDelivery(id: string): Promise<Delivery> {
    return this.request(`/api/deliveries/${id}`);
  }

  async getRiders(): Promise<{ _id: string; name: string; email: string }[]> {
    return this.request('/api/users/riders');
  }

  async updateDelivery(id: string, data: Partial<Delivery>): Promise<Delivery> {
    return this.request(`/api/deliveries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
export { ApiClient };