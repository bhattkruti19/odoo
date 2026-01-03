"""
Comprehensive seed script to create initial data with 20 employees,
attendance records, leave requests, and payroll data
"""
from database import SessionLocal, engine
from models import (
    User, UserRole, Base, MasterEmployee, 
    AttendanceRecord, AttendanceStatus,
    LeaveRequest, LeaveStatus, LeaveType,
    PayrollRecord
)
from auth import get_password_hash
from datetime import date, datetime, timedelta
import random

def get_demo_dob(birth_year, birth_month, birth_day):
    """Helper to create DOB"""
    try:
        return date(birth_year, birth_month, birth_day)
    except:
        return date(birth_year, 1, 1)

def seed_database():
    """Seed complete database with users, attendance, leaves, and payroll"""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Clear existing data
        db.query(PayrollRecord).delete()
        db.query(LeaveRequest).delete()
        db.query(AttendanceRecord).delete()
        db.query(User).delete()
        db.query(MasterEmployee).delete()
        db.commit()
        print("🧹 Database cleared")

        demo_password = "demo123"
        admin_password = "admin123"
        hashed_demo = get_password_hash(demo_password)
        hashed_admin = get_password_hash(admin_password)

        # Admin users
        admins = [
            {
                "full_name": "Amit Sharma",
                "email": "admin@dayflow.com",
                "employee_id": "ADM001",
                "department": "HR",
                "position": "HR Manager",
                "phone": "+91-9876543101",
                "dob": get_demo_dob(1985, 5, 15),
                "address": "Mumbai, India",
                "emergency_contact": "+91-9876543101"
            },
            {
                "full_name": "Priya Singh",
                "email": "priya.singh@dayflow.com",
                "employee_id": "ADM002",
                "department": "HR",
                "position": "HR Business Partner",
                "phone": "+91-9876543102",
                "dob": get_demo_dob(1987, 8, 22),
                "address": "Delhi, India",
                "emergency_contact": "+91-9876543102"
            },
        ]

        # Employee data with comprehensive information
        employees = [
            {"full_name": "Ananya Gupta", "email": "ananya.gupta@dayflow.com", "employee_id": "EMP001", "department": "Engineering", "position": "Software Engineer", "phone": "+91-9810001001", "dob": get_demo_dob(1995, 2, 10), "address": "Bangalore, India", "emergency": "+91-9876543201"},
            {"full_name": "Rohit Verma", "email": "rohit.verma@dayflow.com", "employee_id": "EMP002", "department": "Engineering", "position": "Frontend Engineer", "phone": "+91-9810001002", "dob": get_demo_dob(1993, 6, 18), "address": "Pune, India", "emergency": "+91-9876543202"},
            {"full_name": "Sneha Nair", "email": "sneha.nair@dayflow.com", "employee_id": "EMP003", "department": "Engineering", "position": "Backend Engineer", "phone": "+91-9810001003", "dob": get_demo_dob(1996, 3, 25), "address": "Chennai, India", "emergency": "+91-9876543203"},
            {"full_name": "Vikram Desai", "email": "vikram.desai@dayflow.com", "employee_id": "EMP004", "department": "Product", "position": "Product Manager", "phone": "+91-9810001004", "dob": get_demo_dob(1990, 11, 8), "address": "Mumbai, India", "emergency": "+91-9876543204"},
            {"full_name": "Meera Pillai", "email": "meera.pillai@dayflow.com", "employee_id": "EMP005", "department": "Design", "position": "Product Designer", "phone": "+91-9810001005", "dob": get_demo_dob(1994, 7, 14), "address": "Hyderabad, India", "emergency": "+91-9876543205"},
            {"full_name": "Aditya Kulkarni", "email": "aditya.kulkarni@dayflow.com", "employee_id": "EMP006", "department": "QA", "position": "QA Engineer", "phone": "+91-9810001006", "dob": get_demo_dob(1992, 9, 30), "address": "Pune, India", "emergency": "+91-9876543206"},
            {"full_name": "Ishita Bose", "email": "ishita.bose@dayflow.com", "employee_id": "EMP007", "department": "Engineering", "position": "Data Engineer", "phone": "+91-9810001007", "dob": get_demo_dob(1998, 4, 5), "address": "Kolkata, India", "emergency": "+91-9876543207"},
            {"full_name": "Nitin Mehta", "email": "nitin.mehta@dayflow.com", "employee_id": "EMP008", "department": "Support", "position": "Support Specialist", "phone": "+91-9810001008", "dob": get_demo_dob(1997, 1, 20), "address": "Jaipur, India", "emergency": "+91-9876543208"},
            {"full_name": "Pooja Chawla", "email": "pooja.chawla@dayflow.com", "employee_id": "EMP009", "department": "Finance", "position": "Finance Analyst", "phone": "+91-9810001009", "dob": get_demo_dob(1991, 12, 12), "address": "Gurgaon, India", "emergency": "+91-9876543209"},
            {"full_name": "Siddharth Jain", "email": "siddharth.jain@dayflow.com", "employee_id": "EMP010", "department": "Engineering", "position": "Mobile Engineer", "phone": "+91-9810001010", "dob": get_demo_dob(1994, 8, 28), "address": "Bangalore, India", "emergency": "+91-9876543210"},
            {"full_name": "Lakshmi Rao", "email": "lakshmi.rao@dayflow.com", "employee_id": "EMP011", "department": "People Ops", "position": "HR Coordinator", "phone": "+91-9810001011", "dob": get_demo_dob(1999, 5, 17), "address": "Chennai, India", "emergency": "+91-9876543211"},
            {"full_name": "Arjun Malhotra", "email": "arjun.malhotra@dayflow.com", "employee_id": "EMP012", "department": "Sales", "position": "Account Executive", "phone": "+91-9810001012", "dob": get_demo_dob(1989, 10, 3), "address": "Mumbai, India", "emergency": "+91-9876543212"},
            {"full_name": "Rhea Menon", "email": "rhea.menon@dayflow.com", "employee_id": "EMP013", "department": "Marketing", "position": "Marketing Specialist", "phone": "+91-9810001013", "dob": get_demo_dob(1996, 2, 9), "address": "Hyderabad, India", "emergency": "+91-9876543213"},
            {"full_name": "Saurabh Das", "email": "saurabh.das@dayflow.com", "employee_id": "EMP014", "department": "Engineering", "position": "DevOps Engineer", "phone": "+91-9810001014", "dob": get_demo_dob(1992, 6, 21), "address": "Bangalore, India", "emergency": "+91-9876543214"},
            {"full_name": "Tanya Kapoor", "email": "tanya.kapoor@dayflow.com", "employee_id": "EMP015", "department": "Design", "position": "UX Researcher", "phone": "+91-9810001015", "dob": get_demo_dob(1995, 11, 11), "address": "Delhi, India", "emergency": "+91-9876543215"},
            {"full_name": "Harsh Vardhan", "email": "harsh.vardhan@dayflow.com", "employee_id": "EMP016", "department": "Legal", "position": "Legal Associate", "phone": "+91-9810001016", "dob": get_demo_dob(1990, 3, 19), "address": "Bangalore, India", "emergency": "+91-9876543216"},
            {"full_name": "Gayatri Joshi", "email": "gayatri.joshi@dayflow.com", "employee_id": "EMP017", "department": "Engineering", "position": "QA Lead", "phone": "+91-9810001017", "dob": get_demo_dob(1988, 7, 27), "address": "Pune, India", "emergency": "+91-9876543217"},
            {"full_name": "Mohit Bansal", "email": "mohit.bansal@dayflow.com", "employee_id": "EMP018", "department": "Procurement", "position": "Procurement Associate", "phone": "+91-9810001018", "dob": get_demo_dob(1997, 9, 6), "address": "Delhi, India", "emergency": "+91-9876543218"},
            {"full_name": "Swati Kulshreshtha", "email": "swati.kulshreshtha@dayflow.com", "employee_id": "EMP019", "department": "Admin", "position": "Office Manager", "phone": "+91-9810001019", "dob": get_demo_dob(1993, 4, 14), "address": "Gurgaon, India", "emergency": "+91-9876543219"},
            {"full_name": "Yashwant Puri", "email": "yashwant.puri@dayflow.com", "employee_id": "EMP020", "department": "Security", "position": "Security Lead", "phone": "+91-9810001020", "dob": get_demo_dob(1986, 10, 2), "address": "Mumbai, India", "emergency": "+91-9876543220"},
        ]

        # Create admins
        admin_users = []
        for idx, admin in enumerate(admins, start=1):
            login_id = admin["employee_id"]
            first_name = admin["full_name"].split()[0]
            last_name = " ".join(admin["full_name"].split()[1:]) if len(admin["full_name"].split()) > 1 else ""
            
            master_emp = MasterEmployee(
                employee_id=login_id,
                work_email=admin["email"],
                first_name=first_name,
                last_name=last_name,
                date_of_joining=date(2024, 1, 1),
                joining_year=2024,
                joining_serial=idx,
                role=UserRole.ADMIN,
                is_registered=True,
            )
            db.add(master_emp)
            db.flush()
            
            user = User(
                master_employee_id=master_emp.id,
                login_id=login_id,
                email=admin["email"],
                hashed_password=hashed_admin,
                full_name=admin["full_name"],
                first_name=first_name,
                last_name=last_name,
                date_of_joining=date(2024, 1, 1),
                joining_year=2024,
                joining_serial=idx,
                role=UserRole.ADMIN,
                employee_id=login_id,
                department=admin["department"],
                position=admin["position"],
                phone=admin["phone"],
                date_of_birth=admin["dob"],
                address=admin["address"],
                emergency_contact=admin["emergency_contact"],
                must_change_password=False,
            )
            db.add(user)
            admin_users.append(user)
        
        db.commit()

        # Create employees with attendance, leave, and payroll data
        employee_users = []
        for idx, emp in enumerate(employees, start=1):
            login_id = emp["employee_id"]
            first_name = emp["full_name"].split()[0]
            last_name = " ".join(emp["full_name"].split()[1:]) if len(emp["full_name"].split()) > 1 else ""
            
            master_emp = MasterEmployee(
                employee_id=login_id,
                work_email=emp["email"],
                first_name=first_name,
                last_name=last_name,
                date_of_joining=date(2024, 6, 1),
                joining_year=2024,
                joining_serial=idx,
                role=UserRole.EMPLOYEE,
                is_registered=True,
            )
            db.add(master_emp)
            db.flush()
            
            user = User(
                master_employee_id=master_emp.id,
                login_id=login_id,
                email=emp["email"],
                hashed_password=hashed_demo,
                full_name=emp["full_name"],
                first_name=first_name,
                last_name=last_name,
                date_of_joining=date(2024, 6, 1),
                joining_year=2024,
                joining_serial=idx,
                role=UserRole.EMPLOYEE,
                employee_id=login_id,
                department=emp["department"],
                position=emp["position"],
                phone=emp["phone"],
                date_of_birth=emp["dob"],
                address=emp["address"],
                emergency_contact=emp["emergency"],
                must_change_password=False,
            )
            db.add(user)
            employee_users.append(user)
        
        db.commit()

        # Generate attendance records (last 30 days)
        print("📊 Generating attendance records...")
        today = date.today()
        for user in employee_users:
            for days_back in range(30):
                record_date = today - timedelta(days=days_back)
                
                # Skip weekends (Saturday=5, Sunday=6)
                if record_date.weekday() >= 5:
                    continue
                
                # Random status distribution
                rand = random.random()
                if rand < 0.85:  # 85% present
                    status = AttendanceStatus.PRESENT
                    check_in = datetime.combine(record_date, datetime.strptime("09:00:00", "%H:%M:%S").time())
                    check_out = datetime.combine(record_date, datetime.strptime("18:00:00", "%H:%M:%S").time())
                elif rand < 0.90:  # 5% late
                    status = AttendanceStatus.LATE
                    check_in = datetime.combine(record_date, datetime.strptime("09:30:00", "%H:%M:%S").time())
                    check_out = datetime.combine(record_date, datetime.strptime("18:30:00", "%H:%M:%S").time())
                elif rand < 0.95:  # 5% half day
                    status = AttendanceStatus.HALF_DAY
                    check_in = datetime.combine(record_date, datetime.strptime("09:00:00", "%H:%M:%S").time())
                    check_out = datetime.combine(record_date, datetime.strptime("13:00:00", "%H:%M:%S").time())
                else:  # 5% absent
                    status = AttendanceStatus.ABSENT
                    check_in = None
                    check_out = None
                
                attendance = AttendanceRecord(
                    user_id=user.id,
                    date=record_date,
                    check_in=check_in,
                    check_out=check_out,
                    status=status,
                    notes="Regular working day" if status == AttendanceStatus.PRESENT else f"Status: {status.value}"
                )
                db.add(attendance)
        
        db.commit()

        # Generate leave requests
        print("📋 Generating leave requests...")
        leave_types = [LeaveType.CASUAL, LeaveType.SICK, LeaveType.ANNUAL, LeaveType.UNPAID]
        leave_reasons = {
            LeaveType.CASUAL: ["Family function", "Personal work", "Travel"],
            LeaveType.SICK: ["Medical check-up", "Illness", "Health issue"],
            LeaveType.ANNUAL: ["Vacation", "Holiday", "Break"],
            LeaveType.UNPAID: ["Extended break", "Personal reasons"]
        }
        
        for user in employee_users:
            # Create 2-4 leave requests per employee
            num_leaves = random.randint(2, 4)
            for _ in range(num_leaves):
                leave_type = random.choice(leave_types)
                start = today + timedelta(days=random.randint(5, 30))
                duration = random.randint(1, 5)
                end = start + timedelta(days=duration)
                
                # Random status: 70% approved, 20% pending, 10% rejected
                rand_status = random.random()
                if rand_status < 0.7:
                    status = LeaveStatus.APPROVED
                    approved_by = random.choice(admin_users).id
                elif rand_status < 0.9:
                    status = LeaveStatus.PENDING
                    approved_by = None
                else:
                    status = LeaveStatus.REJECTED
                    approved_by = random.choice(admin_users).id
                
                leave_request = LeaveRequest(
                    user_id=user.id,
                    leave_type=leave_type,
                    start_date=start,
                    end_date=end,
                    reason=random.choice(leave_reasons[leave_type]),
                    status=status,
                    approved_by=approved_by,
                    admin_notes="Approved" if status == LeaveStatus.APPROVED else ("Under review" if status == LeaveStatus.PENDING else "Not approved")
                )
                db.add(leave_request)
        
        db.commit()

        # Generate payroll records (last 12 months)
        print("💰 Generating payroll records...")
        base_salaries = {
            "Software Engineer": 60000,
            "Frontend Engineer": 55000,
            "Backend Engineer": 60000,
            "Product Manager": 75000,
            "Product Designer": 50000,
            "QA Engineer": 45000,
            "Data Engineer": 65000,
            "Support Specialist": 35000,
            "Finance Analyst": 50000,
            "Mobile Engineer": 60000,
            "HR Coordinator": 38000,
            "Account Executive": 55000,
            "Marketing Specialist": 45000,
            "DevOps Engineer": 70000,
            "UX Researcher": 52000,
            "Legal Associate": 48000,
            "QA Lead": 55000,
            "Procurement Associate": 40000,
            "Office Manager": 42000,
            "Security Lead": 65000,
        }
        
        for user in employee_users:
            base_salary = base_salaries.get(user.position, 50000)
            
            for months_back in range(12):
                month = (today.month - months_back) % 12
                if month == 0:
                    month = 12
                year = today.year if months_back < today.month else today.year - 1
                
                allowances = base_salary * 0.20  # 20% allowances
                deductions = base_salary * 0.10  # 10% deductions
                bonus = base_salary * 0.05 if months_back % 3 == 0 else 0
                tax = (base_salary + allowances) * 0.15  # 15% tax
                net = base_salary + allowances + bonus - deductions - tax
                
                payroll = PayrollRecord(
                    user_id=user.id,
                    month=month,
                    year=year,
                    base_salary=base_salary,
                    allowances=allowances,
                    deductions=deductions,
                    bonus=bonus,
                    tax=tax,
                    net_salary=max(net, 0),
                    payment_date=date(year, month, 25),
                    payment_method="Bank Transfer",
                    notes="Regular monthly payroll"
                )
                db.add(payroll)
        
        db.commit()

        print("\n✅ Database seeded successfully!")
        print(f"   - {len(admin_users)} Admin users created")
        print(f"   - {len(employee_users)} Employee users created")
        print(f"   - Attendance records: 20 employees × ~22 working days = ~440 records")
        print(f"   - Leave requests: 20 employees × 2-4 leaves = ~60 records")
        print(f"   - Payroll records: 20 employees × 12 months = 240 records")
        
        print("\n🔐 Login Credentials:")
        print("   Admin: admin@dayflow.com / admin123")
        print("   Employees: Use respective emails with password: demo123")
        
        print("\n📧 Employee Emails:")
        for emp in employees:
            print(f"   - {emp['email']}")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

