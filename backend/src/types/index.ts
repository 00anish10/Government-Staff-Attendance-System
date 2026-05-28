export interface Department {
  id: number;
  name: string;
  name_np: string;
  code: string;
  description: string | null;
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
  department_id: number;
  department_name?: string;
  profile_image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: number;
  staff_id: number;
  staff_name?: string;
  employee_id?: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'holiday' | 'leave';
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: number;
  staff_id: number;
  staff_name?: string;
  employee_id?: string;
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

export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: 'admin' | 'hr' | 'supervisor' | 'staff';
  staff_id: number | null;
  is_active: boolean;
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
