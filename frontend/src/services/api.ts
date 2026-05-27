const API_BASE = '/api';
const AUTH_TOKEN = btoa('admin:admin123');

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  dashboard: {
    stats: () => request<any>('/dashboard/stats'),
    trends: () => request<any[]>('/dashboard/trends'),
    departments: () => request<any[]>('/dashboard/departments'),
  },
  departments: {
    list: () => request<any[]>('/departments'),
    get: (id: number) => request<any>(`/departments/${id}`),
    create: (data: any) => request<any>('/departments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request<any>(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<any>(`/departments/${id}`, { method: 'DELETE' }),
  },
  designations: {
    list: (departmentId?: number) => request<any[]>(`/designations${departmentId ? `?department_id=${departmentId}` : ''}`),
    get: (id: number) => request<any>(`/designations/${id}`),
    create: (data: any) => request<any>('/designations', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request<any>(`/designations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<any>(`/designations/${id}`, { method: 'DELETE' }),
  },
  staff: {
    list: (params?: { page?: number; limit?: number; search?: string; department_id?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.search) query.set('search', params.search);
      if (params?.department_id) query.set('department_id', params.department_id);
      return request<any>(`/staff?${query}`);
    },
    get: (id: number) => request<any>(`/staff/${id}`),
    create: (data: any) => request<any>('/staff', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request<any>(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
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
      return request<any>(`/attendance?${query}`);
    },
    today: () => request<any[]>('/attendance/today'),
    staffHistory: (id: number, limit?: number) =>
      request<any[]>(`/attendance/staff/${id}${limit ? `?limit=${limit}` : ''}`),
    checkIn: (staff_id: number) => request<any>('/attendance/check-in', { method: 'POST', body: JSON.stringify({ staff_id }) }),
    checkOut: (staff_id: number) => request<any>('/attendance/check-out', { method: 'POST', body: JSON.stringify({ staff_id }) }),
    mark: (data: any) => request<any>('/attendance/mark', { method: 'POST', body: JSON.stringify(data) }),
  },
  leaves: {
    list: (params?: { page?: number; limit?: number; status?: string; staff_id?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.status) query.set('status', params.status);
      if (params?.staff_id) query.set('staff_id', params.staff_id);
      return request<any>(`/leaves?${query}`);
    },
    create: (data: any) => request<any>('/leaves', { method: 'POST', body: JSON.stringify(data) }),
    approve: (id: number, approved_by: number, remarks?: string) =>
      request<any>(`/leaves/${id}/approve`, { method: 'PUT', body: JSON.stringify({ approved_by, remarks }) }),
    reject: (id: number, approved_by: number, remarks?: string) =>
      request<any>(`/leaves/${id}/reject`, { method: 'PUT', body: JSON.stringify({ approved_by, remarks }) }),
  },
};
