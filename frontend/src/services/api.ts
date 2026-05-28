const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout() {
  setToken(null);
  localStorage.removeItem('user');
}

export function getStoredUser() {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...options,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (res.status === 401) {
    if (isJson) {
      const data = await res.json();
      throw new Error(data.error || 'Invalid credentials');
    }
    if (token) {
      logout();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Authentication failed');
  }

  if (!isJson) {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  }

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data.error || data.errors?.join(', ') || `Request failed (${res.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ data: { token: string; user: any } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    me: () => request<{ data: any }>('/auth/me'),
  },
  dashboard: {
    stats: () => request<any>('/dashboard/stats'),
    trends: () => request<any[]>('/dashboard/trends'),
    departments: () => request<any[]>('/dashboard/departments'),
  },
  departments: {
    list: () => request<{ data: any[] }>('/departments').then(r => r.data),
    get: (id: number) => request<{ data: any }>(`/departments/${id}`).then(r => r.data),
    create: (data: any) => request<{ data: any }>('/departments', { method: 'POST', body: JSON.stringify(data) }).then(r => r.data),
    update: (id: number, data: any) => request<{ data: any }>(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data),
    delete: (id: number) => request<any>(`/departments/${id}`, { method: 'DELETE' }),
  },
  designations: {
    list: (departmentId?: number) =>
      request<{ data: any[] }>(`/designations${departmentId ? `?department_id=${departmentId}` : ''}`).then(r => r.data),
    get: (id: number) => request<{ data: any }>(`/designations/${id}`).then(r => r.data),
    create: (data: any) => request<{ data: any }>('/designations', { method: 'POST', body: JSON.stringify(data) }).then(r => r.data),
    update: (id: number, data: any) => request<{ data: any }>(`/designations/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data),
    delete: (id: number) => request<any>(`/designations/${id}`, { method: 'DELETE' }),
  },
  staff: {
    list: (params?: { page?: number; limit?: number; search?: string; department_id?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.search) query.set('search', params.search);
      if (params?.department_id) query.set('department_id', params.department_id);
      return request<{ data: any[]; pagination: any }>(`/staff?${query}`);
    },
    get: (id: number) => request<{ data: any }>(`/staff/${id}`).then(r => r.data),
    create: (data: any) => request<{ data: any }>('/staff', { method: 'POST', body: JSON.stringify(data) }).then(r => r.data),
    update: (id: number, data: any) => request<{ data: any }>(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data),
    delete: (id: number) => request<any>(`/staff/${id}`, { method: 'DELETE' }),
  },
  attendance: {
    list: (params?: { page?: number; limit?: number; date?: string; staff_id?: string; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.date) query.set('date', params.date);
      if (params?.staff_id) query.set('staff_id', params.staff_id);
      if (params?.status) query.set('status', params.status);
      return request<{ data: any[]; pagination: any }>(`/attendance?${query}`);
    },
    today: () => request<any[]>('/attendance/today'),
    staffHistory: (id: number, limit?: number) =>
      request<{ data: any[] }>(`/attendance/staff/${id}${limit ? `?limit=${limit}` : ''}`).then(r => r.data),
    checkIn: (staff_id: number) => request<{ data: any }>('/attendance/check-in', { method: 'POST', body: JSON.stringify({ staff_id }) }).then(r => r.data),
    checkOut: (staff_id: number) => request<{ data: any }>('/attendance/check-out', { method: 'POST', body: JSON.stringify({ staff_id }) }).then(r => r.data),
    mark: (data: any) => request<{ data: any }>('/attendance/mark', { method: 'POST', body: JSON.stringify(data) }).then(r => r.data),
  },
  leaves: {
    list: (params?: { page?: number; limit?: number; status?: string; staff_id?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.status) query.set('status', params.status);
      if (params?.staff_id) query.set('staff_id', params.staff_id);
      return request<{ data: any[]; pagination: any }>(`/leaves?${query}`);
    },
    create: (data: any) => request<{ data: any }>('/leaves', { method: 'POST', body: JSON.stringify(data) }).then(r => r.data),
    approve: (id: number, approved_by: number, remarks?: string) =>
      request<{ data: any }>(`/leaves/${id}/approve`, { method: 'PUT', body: JSON.stringify({ approved_by, remarks }) }).then(r => r.data),
    reject: (id: number, approved_by: number, remarks?: string) =>
      request<{ data: any }>(`/leaves/${id}/reject`, { method: 'PUT', body: JSON.stringify({ approved_by, remarks }) }).then(r => r.data),
  },
};
