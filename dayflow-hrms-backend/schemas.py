from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date
from models import UserRole, AttendanceStatus, LeaveStatus, LeaveType


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: UserRole = UserRole.EMPLOYEE
    employee_id: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    login_id: Optional[str] = None
    date_of_joining: Optional[date] = None
    joining_year: Optional[int] = None
    joining_serial: Optional[int] = None
    must_change_password: Optional[bool] = None


class UserCreate(UserBase):
    employee_id: str = Field(..., min_length=1)
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    emergency_contact: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    master_employee_id: Optional[int] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Master Employee Schemas
class MasterEmployeeBase(BaseModel):
    employee_id: str
    work_email: EmailStr
    role: UserRole = UserRole.EMPLOYEE
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_joining: Optional[date] = None
    joining_year: Optional[int] = None
    joining_serial: Optional[int] = None


class MasterEmployeeCreate(MasterEmployeeBase):
    pass


class MasterEmployeeResponse(MasterEmployeeBase):
    id: int
    is_registered: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MasterEmployeeBulkRow(MasterEmployeeBase):
    pass


class MasterEmployeeBulkResult(BaseModel):
    inserted: int
    skipped: int
    updated: int
    errors: list[str] = []


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    login: str = Field(..., description="login_id or email")
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class AdminCreateUserRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role: UserRole = UserRole.EMPLOYEE
    date_of_joining: date
    department: Optional[str] = None
    position: Optional[str] = None


class AdminCreateUserResponse(BaseModel):
    user: UserResponse
    temp_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class AdminResetPasswordResponse(BaseModel):
    user: UserResponse
    temp_password: str = Field(..., min_length=8)


# Attendance Schemas
class AttendanceRecordBase(BaseModel):
    date: date
    status: AttendanceStatus = AttendanceStatus.PRESENT
    notes: Optional[str] = None


class AttendanceRecordCreate(AttendanceRecordBase):
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None


class AttendanceRecordUpdate(BaseModel):
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    status: Optional[AttendanceStatus] = None
    notes: Optional[str] = None


class AttendanceRecordResponse(AttendanceRecordBase):
    id: int
    user_id: int
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Leave Schemas
class LeaveRequestBase(BaseModel):
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str


class LeaveRequestCreate(LeaveRequestBase):
    pass


class LeaveRequestUpdate(BaseModel):
    status: Optional[LeaveStatus] = None
    admin_notes: Optional[str] = None


class LeaveRequestResponse(LeaveRequestBase):
    id: int
    user_id: int
    status: LeaveStatus
    admin_notes: Optional[str] = None
    approved_by: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Payroll Schemas
class PayrollRecordBase(BaseModel):
    month: int = Field(..., ge=1, le=12)
    year: int
    base_salary: float
    allowances: float = 0.0
    deductions: float = 0.0
    bonus: float = 0.0
    tax: float = 0.0
    net_salary: float
    payment_date: Optional[date] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class PayrollRecordCreate(PayrollRecordBase):
    user_id: int


class PayrollRecordUpdate(BaseModel):
    base_salary: Optional[float] = None
    allowances: Optional[float] = None
    deductions: Optional[float] = None
    bonus: Optional[float] = None
    tax: Optional[float] = None
    net_salary: Optional[float] = None
    payment_date: Optional[date] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class PayrollRecordResponse(PayrollRecordBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Stats Schemas
class DashboardStats(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
    pending_leave_requests: int
    total_departments: int


class AttendanceStats(BaseModel):
    total_days: int
    present_days: int
    absent_days: int
    late_days: int
    attendance_rate: float
