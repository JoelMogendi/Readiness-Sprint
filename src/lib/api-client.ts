export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get token from localStorage (only on client side)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add token if it exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge with any custom headers passed in
  if (options.headers) {
    const customHeaders = options.headers as Record<string, string>;
    Object.keys(customHeaders).forEach(key => {
      headers[key] = customHeaders[key];
    });
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    // Try to parse response as JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Log the error for debugging
      console.error(`❌ API Error (${response.status}):`, data);
      throw new Error(
        typeof data === 'object' && data !== null
          ? data.message || data.error || `API Error: ${response.status}`
          : `API Error: ${response.status}`
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ API Request failed:', error.message);
      throw error;
    }
    throw new Error('Unknown API error occurred');
  }
}

// Helper to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
}

// Helper to get the token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}