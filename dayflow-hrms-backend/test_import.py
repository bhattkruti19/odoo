#!/usr/bin/env python3
import sys
import traceback

print("Python path:", sys.path[:3])
print("\nAttempting imports...")

try:
    print("1. Importing database...")
    from database import engine, Base
    print("   ✓ database imported")
    
    print("2. Importing models...")
    from models import User, MasterEmployee, AttendanceRecord, LeaveRequest, PayrollRecord
    print("   ✓ models imported")
    
    print("3. Importing schemas...")
    from schemas import UserResponse, UserUpdate
    print("   ✓ schemas imported")
    
    print("4. Importing routers...")
    from routers import auth_routes, user_routes, attendance_routes, leave_routes, payroll_routes, master_employee_routes
    print("   ✓ routers imported")
    
    print("5. Importing FastAPI...")
    from fastapi import FastAPI
    print("   ✓ FastAPI imported")
    
    print("6. Importing config...")
    from config import settings
    print("   ✓ config imported")
    
    print("\n✅ All imports successful!")
    
except Exception as e:
    print(f"\n❌ Import error: {e}")
    traceback.print_exc()
