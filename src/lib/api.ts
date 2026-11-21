const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5055/api';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('fixmate_token');
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('fixmate_token', token);
    document.cookie = `fixmate_token=${token}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    localStorage.removeItem('fixmate_token');
    document.cookie = 'fixmate_token=; path=/; max-age=0; SameSite=Lax';
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `HTTP ${response.status} Error`;
    throw new Error(errorMsg);
  }

  return data as T;
}
