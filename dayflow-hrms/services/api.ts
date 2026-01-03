import axios from 'axios';
import { User, AttendanceRecord, LeaveRequest, PayrollRecord } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (payload: { login: string; password: string }) => {
    const response = await api.post('/auth/login', payload);
    const data = response.data;
    const u = data.user;
    return {
      ...data,
      user: {
        ...u,
        name: u.full_name || u.name,
        id: u.id?.toString() || '',
        loginId: u.login_id || u.loginId,
        employeeId: u.employee_id || u.employeeId,
        mustChangePassword: u.must_change_password ?? u.mustChangePassword,
        dateOfBirth: u.date_of_birth || u.dateOfBirth,
        emergencyContact: u.emergency_contact || u.emergencyContact,
      },
    };
  },
  adminCreateUser: async (payload: {
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'employee';
    date_of_joining: string;
    department?: string;
    position?: string;
  }) => {
    const response = await api.post('/auth/admin/create-user', payload);
    const { user, temp_password } = response.data;
    return {
      user: {
        ...user,
        name: user.full_name || user.name,
        id: user.id?.toString() || '',
        loginId: user.login_id || user.loginId,
        employeeId: user.employee_id || user.employeeId,
        mustChangePassword: user.must_change_password ?? user.mustChangePassword,
      },
      tempPassword: temp_password,
    };
  },
  changePasswordFirst: async (payload: { current_password: string; new_password: string }) => {
    const response = await api.post('/auth/change-password-first', payload);
    const u = response.data;
    return {
      ...u,
      name: u.full_name || u.name,
      id: u.id?.toString() || '',
      loginId: u.login_id || u.loginId,
      employeeId: u.employee_id || u.employeeId,
      mustChangePassword: u.must_change_password ?? u.mustChangePassword,
    };
  },
  adminResetPassword: async (userId: string) => {
    const response = await api.post(`/auth/admin/reset-password/${userId}`);
    const { user, temp_password } = response.data;
    return {
      user: {
        ...user,
        name: user.full_name || user.name,
        id: user.id?.toString() || '',
        loginId: user.login_id || user.loginId,
        employeeId: user.employee_id || user.employeeId,
        mustChangePassword: user.must_change_password ?? user.mustChangePassword,
      },
      tempPassword: temp_password,
    };
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};

// User API
export const userAPI = {
  getProfile: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return {
      ...response.data,
      name: response.data.full_name || response.data.name,
      id: response.data.id?.toString() || '',
      loginId: response.data.login_id || response.data.loginId,
      employeeId: response.data.employee_id || response.data.employeeId,
      mustChangePassword: response.data.must_change_password ?? response.data.mustChangePassword,
      dateOfBirth: response.data.date_of_birth || response.data.dateOfBirth,
      emergencyContact: response.data.emergency_contact || response.data.emergencyContact,
    };
  },
  updateCurrentProfile: async (data: {
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    date_of_birth?: string;
    emergency_contact?: string;
  }): Promise<User> => {
    const response = await api.put('/users/me', data);
    return {
      ...response.data,
      name: response.data.full_name || response.data.name,
      id: response.data.id?.toString() || '',
      loginId: response.data.login_id || response.data.loginId,
      employeeId: response.data.employee_id || response.data.employeeId,
      mustChangePassword: response.data.must_change_password ?? response.data.mustChangePassword,
      dateOfBirth: response.data.date_of_birth || response.data.dateOfBirth,
      emergencyContact: response.data.emergency_contact || response.data.emergencyContact,
    };
  },
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${userId}`, data);
    return {
      ...response.data,
      name: response.data.full_name || response.data.name,
      id: response.data.id?.toString() || '',
      loginId: response.data.login_id || response.data.loginId,
      employeeId: response.data.employee_id || response.data.employeeId,
      mustChangePassword: response.data.must_change_password ?? response.data.mustChangePassword,
      dateOfBirth: response.data.date_of_birth || response.data.dateOfBirth,
      emergencyContact: response.data.emergency_contact || response.data.emergencyContact,
    };
  },
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data.map((user: any) => ({
      ...user,
      name: user.full_name || user.name,
      id: user.id?.toString() || '',
      loginId: user.login_id || user.loginId,
      employeeId: user.employee_id || user.employeeId,
      mustChangePassword: user.must_change_password ?? user.mustChangePassword,
      dateOfBirth: user.date_of_birth || user.dateOfBirth,
      emergencyContact: user.emergency_contact || user.emergencyContact,
    }));
  },
};

// Attendance API
export const attendanceAPI = {
  getMyRecords: async (): Promise<AttendanceRecord[]> => {
    const response = await api.get('/attendance/my-records');
    return response.data;
  },
  getAttendance: async (userId?: string): Promise<AttendanceRecord[]> => {
    const url = userId ? `/attendance/all?user_id=${userId}` : '/attendance/all';
    const response = await api.get(url);
    return response.data;
  },
  checkIn: async () => {
    const response = await api.post('/attendance/check-in');
    return response.data;
  },
  checkOut: async () => {
    const response = await api.post('/attendance/check-out');
    return response.data;
  },
  getMyStats: async () => {
    const response = await api.get('/attendance/my-stats');
    return response.data;
  },
};

// Leave API
export const leaveAPI = {
  getMyLeaves: async (): Promise<LeaveRequest[]> => {
    const response = await api.get('/leave/my-requests');
    return response.data;
  },
  getAllLeaves: async (): Promise<LeaveRequest[]> => {
    const response = await api.get('/leave/all');
    return response.data;
  },
  getPendingLeaves: async (): Promise<LeaveRequest[]> => {
    const response = await api.get('/leave/all?status=pending');
    return response.data;
  },
  createLeave: async (data: any) => {
    const response = await api.post('/leave', data);
    return response.data;
  },
  approveLeave: async (leaveId: string, adminNotes?: string) => {
    const response = await api.post(`/leave/${leaveId}/approve`, adminNotes ? { admin_notes: adminNotes } : {});
    return response.data;
  },
  rejectLeave: async (leaveId: string, adminNotes?: string) => {
    const response = await api.post(`/leave/${leaveId}/reject`, adminNotes ? { admin_notes: adminNotes } : {});
    return response.data;
  },
};

// Payroll API
export const payrollAPI = {
  getPayroll: async (userId?: string): Promise<PayrollRecord[]> => {
    const url = userId ? `/payroll?userId=${userId}` : '/payroll';
    const response = await api.get(url);
    return response.data;
  },
  updatePayroll: async (payrollId: string, data: Partial<PayrollRecord>) => {
    const response = await api.put(`/payroll/${payrollId}`, data);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard');
    return response.data;
  },
  getAttendanceReport: async (startDate: string, endDate: string) => {
    const response = await api.get('/reports/attendance', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default api;
