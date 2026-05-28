export interface Department {
  id: number;
  name: string;
  name_np: string;
  code: string;
  description: string | null;
  staff_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Designation {
  id: number;
  title: string;
  title_np: string;
  grade: string;
  pay_scale: number;
  department_id: number;
  department_name?: string;
  department_name_np?: string;
  staff_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: number;
  employee_id: string;
  full_name: string;
  full_name_np: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  date_of_joining: string;
  age: number;
  is_minor: boolean;
  gender: 'male' | 'female' | 'other';
  designation_id: number;
  designation_title?: string;
  designation_title_np?: string;
  department_id: number;
  department_name?: string;
  department_name_np?: string;
  profile_image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: number;
  staff_id: number;
  staff_name?: string;
  staff_name_np?: string;
  employee_id?: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'holiday' | 'leave';
  remarks: string | null;
  department_name?: string;
  designation_title?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: number;
  staff_id: number;
  staff_name?: string;
  staff_name_np?: string;
  employee_id?: string;
  department_name?: string;
  leave_type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'other';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by: number | null;
  approver_name?: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_staff: number;
  present_today: number;
  absent_today: number;
  on_leave_today: number;
  late_today: number;
  pending_leaves: number;
  department_count: number;
  attendance_percentage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AttendanceTrend {
  date: string;
  present: number;
  late: number;
  absent: number;
  on_leave: number;
  total: number;
}

export interface DepartmentStat {
  id: number;
  name: string;
  name_np: string;
  code: string;
  total_staff: number;
  present: number;
  late: number;
  absent: number;
  on_leave: number;
}

export type LeaveType = 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'other';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'holiday' | 'leave';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type Gender = 'male' | 'female' | 'other';
