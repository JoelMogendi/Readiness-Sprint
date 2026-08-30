const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  itemDescription: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered';
  retailerId: string;
  dispatcherId?: string;
  riderId?: string;
  rider?: {
    id: string;
    name: string;
  };
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  itemDescription: string;
}

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
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // Get all deliveries for the retailer
  async getDeliveries(): Promise<Delivery[]> {
    return this.request('/deliveries/retailer');
  }

  // Create a new delivery
  async createDelivery(data: DeliveryInput): Promise<Delivery> {
    return this.request('/deliveries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get a single delivery
  async getDelivery(id: string): Promise<Delivery> {
    return this.request(`/deliveries/${id}`);
  }
}

// Export the client instance
export const apiClient = new ApiClient();

// Also export the class for testing if needed
export { ApiClient };