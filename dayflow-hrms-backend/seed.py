"""
Seed script to create initial admin and employee users for testing
"""
from database import SessionLocal, engine
from models import User, UserRole, Base, MasterEmployee
from auth import get_password_hash
from datetime import date

def seed_users():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Wipe existing users and master employees for a clean demo slate
        deleted_users = db.query(User).delete()
        deleted_master = db.query(MasterEmployee).delete()
        db.commit()
        print(f"🧹 Cleared {deleted_users} existing users and {deleted_master} master employees")

        # Shared simple password for demo users
        demo_password = "demo123"
        hashed_default = get_password_hash(demo_password)

        admins = [
            {
                "full_name": "Amit Sharma",
                "email": "amit.sharma@dayflow.com",
                "employee_id": "ADM001",
                "department": "HR",
                "position": "HR Manager",
                "phone": "+91-9876543101",
            },
            {
                "full_name": "Dhiraj Admin",
                "email": "dhiraj@admin.com",
                "employee_id": "ADM000",
                "department": "HR",
                "position": "Administrator",
                "phone": "+91-9876543100",
                "password": "admin123",
            },
            {
                "full_name": "Priya Singh",
                "email": "priya.singh@dayflow.com",
                "employee_id": "ADM002",
                "department": "HR",
                "position": "HR Business Partner",
                "phone": "+91-9876543102",
            },
            {
                "full_name": "Ravi Iyer",
                "email": "ravi.iyer@dayflow.com",
                "employee_id": "ADM003",
                "department": "HR",
                "position": "People Operations Lead",
                "phone": "+91-9876543103",
            },
            {
                "full_name": "Neha Patel",
                "email": "neha.patel@dayflow.com",
                "employee_id": "ADM004",
                "department": "HR",
                "position": "Compensation Analyst",
                "phone": "+91-9876543104",
            },
            {
                "full_name": "Karthik Reddy",
                "email": "karthik.reddy@dayflow.com",
                "employee_id": "ADM005",
                "department": "HR",
                "position": "Talent Acquisition Lead",
                "phone": "+91-9876543105",
            },
        ]

        employees = [
            {"full_name": "Ananya Gupta", "email": "ananya.gupta@dayflow.com", "employee_id": "EMP001", "department": "Engineering", "position": "Software Engineer", "phone": "+91-9810001001"},
            {"full_name": "Rohit Verma", "email": "rohit.verma@dayflow.com", "employee_id": "EMP002", "department": "Engineering", "position": "Frontend Engineer", "phone": "+91-9810001002"},
            {"full_name": "Sneha Nair", "email": "sneha.nair@dayflow.com", "employee_id": "EMP003", "department": "Engineering", "position": "Backend Engineer", "phone": "+91-9810001003"},
            {"full_name": "Vikram Desai", "email": "vikram.desai@dayflow.com", "employee_id": "EMP004", "department": "Product", "position": "Product Manager", "phone": "+91-9810001004"},
            {"full_name": "Meera Pillai", "email": "meera.pillai@dayflow.com", "employee_id": "EMP005", "department": "Design", "position": "Product Designer", "phone": "+91-9810001005"},
            {"full_name": "Aditya Kulkarni", "email": "aditya.kulkarni@dayflow.com", "employee_id": "EMP006", "department": "QA", "position": "QA Engineer", "phone": "+91-9810001006"},
            {"full_name": "Ishita Bose", "email": "ishita.bose@dayflow.com", "employee_id": "EMP007", "department": "Engineering", "position": "Data Engineer", "phone": "+91-9810001007"},
            {"full_name": "Nitin Mehta", "email": "nitin.mehta@dayflow.com", "employee_id": "EMP008", "department": "Support", "position": "Support Specialist", "phone": "+91-9810001008"},
            {"full_name": "Pooja Chawla", "email": "pooja.chawla@dayflow.com", "employee_id": "EMP009", "department": "Finance", "position": "Finance Analyst", "phone": "+91-9810001009"},
            {"full_name": "Siddharth Jain", "email": "siddharth.jain@dayflow.com", "employee_id": "EMP010", "department": "Engineering", "position": "Mobile Engineer", "phone": "+91-9810001010"},
            {"full_name": "Lakshmi Rao", "email": "lakshmi.rao@dayflow.com", "employee_id": "EMP011", "department": "People Ops", "position": "HR Coordinator", "phone": "+91-9810001011"},
            {"full_name": "Arjun Malhotra", "email": "arjun.malhotra@dayflow.com", "employee_id": "EMP012", "department": "Sales", "position": "Account Executive", "phone": "+91-9810001012"},
            {"full_name": "Rhea Menon", "email": "rhea.menon@dayflow.com", "employee_id": "EMP013", "department": "Marketing", "position": "Marketing Specialist", "phone": "+91-9810001013"},
            {"full_name": "Saurabh Das", "email": "saurabh.das@dayflow.com", "employee_id": "EMP014", "department": "Engineering", "position": "DevOps Engineer", "phone": "+91-9810001014"},
            {"full_name": "Tanya Kapoor", "email": "tanya.kapoor@dayflow.com", "employee_id": "EMP015", "department": "Design", "position": "UX Researcher", "phone": "+91-9810001015"},
            {"full_name": "Harsh Vardhan", "email": "harsh.vardhan@dayflow.com", "employee_id": "EMP016", "department": "Legal", "position": "Legal Associate", "phone": "+91-9810001016"},
            {"full_name": "Gayatri Joshi", "email": "gayatri.joshi@dayflow.com", "employee_id": "EMP017", "department": "Engineering", "position": "QA Lead", "phone": "+91-9810001017"},
            {"full_name": "Mohit Bansal", "email": "mohit.bansal@dayflow.com", "employee_id": "EMP018", "department": "Procurement", "position": "Procurement Associate", "phone": "+91-9810001018"},
            {"full_name": "Swati Kulshreshtha", "email": "swati.kulshreshtha@dayflow.com", "employee_id": "EMP019", "department": "Admin", "position": "Office Manager", "phone": "+91-9810001019"},
            {"full_name": "Yashwant Puri", "email": "yashwant.puri@dayflow.com", "employee_id": "EMP020", "department": "Security", "position": "Security Lead", "phone": "+91-9810001020"},
        ]

        # Create admins with proper schema including login_id
        for idx, admin in enumerate(admins, start=1):
            password_to_use = admin.get("password", demo_password)
            login_id = admin["employee_id"]
            first_name = admin["full_name"].split()[0]
            last_name = " ".join(admin["full_name"].split()[1:]) if len(admin["full_name"].split()) > 1 else ""
            
            # Create master employee
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
            
            db.add(
                User(
                    master_employee_id=master_emp.id,
                    login_id=login_id,
                    email=admin["email"],
                    hashed_password=get_password_hash(password_to_use),
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
                    must_change_password=False,
                )
            )

        # Create employees with proper schema
        for idx, emp in enumerate(employees, start=1):
            login_id = emp["employee_id"]
            first_name = emp["full_name"].split()[0]
            last_name = " ".join(emp["full_name"].split()[1:]) if len(emp["full_name"].split()) > 1 else ""
            
            # Create master employee
            master_emp = MasterEmployee(
                employee_id=login_id,
                work_email=emp["email"],
                first_name=first_name,
                last_name=last_name,
                date_of_joining=date(2025, 1, 1),
                joining_year=2025,
                joining_serial=idx,
                role=UserRole.EMPLOYEE,
                is_registered=True,
            )
            db.add(master_emp)
            db.flush()
            
            db.add(
                User(
                    master_employee_id=master_emp.id,
                    login_id=login_id,
                    email=emp["email"],
                    hashed_password=hashed_default,
                    full_name=emp["full_name"],
                    first_name=first_name,
                    last_name=last_name,
                    date_of_joining=date(2025, 1, 1),
                    joining_year=2025,
                    joining_serial=idx,
                    role=UserRole.EMPLOYEE,
                    employee_id=login_id,
                    department=emp["department"],
                    position=emp["position"],
                    phone=emp["phone"],
                    must_change_password=False,
                )
            )

        db.commit()

        print("\n🎉 Database seeded with demo users!")
        print("\nAdmins (role=admin):")
        for admin in admins:
            password_to_use = admin.get("password", demo_password)
            print(f"- {admin['full_name']} | {admin['email']} | password: {password_to_use}")

        print("\nEmployees (role=employee):")
        for emp in employees:
            print(f"- {emp['full_name']} | {emp['email']} | password: {demo_password}")

        print("\nUse the same password for all demo users: demo123")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
