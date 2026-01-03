export interface User {
  id: string;
  name: string;
  email: string;
  loginId?: string;
  role: 'admin' | 'employee';
  employeeId?: string;
  department?: string;
  position?: string;
  salary?: number;
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  joinDate?: string;
  mustChangePassword?: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'leave' | 'late';
  workingHours?: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  leaveType: 'sick' | 'casual' | 'annual' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  comment?: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  userName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  monthlyPayroll: number;
  attendanceRate: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  type: 'attendance' | 'leave' | 'payroll' | 'profile';
}
