# 🚀 Dayflow HRMS Backend

FastAPI-based backend for the Dayflow Human Resource Management System with PostgreSQL database, JWT authentication, and comprehensive HR features.

## ✨ Features

- **JWT Authentication**: Secure token-based authentication with role-based access control
- **User Management**: Complete CRUD operations for employees and admins
- **Attendance Tracking**: Check-in/out system with attendance records and analytics
- **Leave Management**: Leave request submission, approval/rejection workflow
- **Payroll System**: Salary management with breakdown (base, allowances, deductions, tax)
- **Role-Based Authorization**: Separate permissions for admin and employee roles
- **Database Migrations**: Alembic for version-controlled schema changes
- **API Documentation**: Auto-generated Swagger UI and ReDoc

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.115.0
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (python-jose) + bcrypt password hashing
- **Validation**: Pydantic v2
- **Migrations**: Alembic
- **ASGI Server**: Uvicorn

## 📋 Prerequisites

- Python 3.9+
- PostgreSQL 12+
- pip (Python package manager)

## 🚀 Installation & Setup

### 1. Clone and Navigate

```bash
cd dayflow-hrms-backend
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE dayflow_hrms;
```

### 5. Environment Variables

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/dayflow_hrms
SECRET_KEY=your-super-secret-key-min-32-characters-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

### 6. Initialize Database

The database tables will be created automatically when you first run the app. Alternatively, use Alembic:

```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 7. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or use Python directly
python main.py
```

Server will start at: **http://localhost:8000**

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## 🔐 Authentication Flow

### 1. Register a New User

```bash
POST /api/auth/register
{
  "email": "admin@dayflow.com",
  "password": "admin123",
  "full_name": "Admin User",
  "role": "admin",
  "department": "Management",
  "position": "System Administrator"
}
```

### 2. Login

```bash
POST /api/auth/login
{
  "email": "admin@dayflow.com",
  "password": "admin123",
  "role": "admin"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### 3. Use Token

Add to request headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)

### User Management

- `GET /api/users/me` - Get current user info
- `PUT /api/users/me` - Update current user
- `GET /api/users/` - Get all users (Admin)
- `GET /api/users/{user_id}` - Get user by ID (Admin)
- `PUT /api/users/{user_id}` - Update user (Admin)
- `DELETE /api/users/{user_id}` - Delete user (Admin)
- `GET /api/users/stats/dashboard` - Get dashboard stats (Admin)

### Attendance

- `POST /api/attendance/check-in` - Check in for today
- `POST /api/attendance/check-out` - Check out for today
- `GET /api/attendance/my-records` - Get my attendance records
- `GET /api/attendance/my-stats` - Get my attendance statistics
- `GET /api/attendance/all` - Get all records (Admin)
- `GET /api/attendance/{record_id}` - Get record by ID
- `PUT /api/attendance/{record_id}` - Update record (Admin)
- `DELETE /api/attendance/{record_id}` - Delete record (Admin)

### Leave Management

- `POST /api/leave/` - Create leave request
- `GET /api/leave/my-requests` - Get my leave requests
- `GET /api/leave/all` - Get all requests (Admin)
- `GET /api/leave/{request_id}` - Get request by ID
- `PUT /api/leave/{request_id}` - Update request status (Admin)
- `POST /api/leave/{request_id}/approve` - Approve request (Admin)
- `POST /api/leave/{request_id}/reject` - Reject request (Admin)
- `DELETE /api/leave/{request_id}` - Delete request

### Payroll

- `POST /api/payroll/` - Create payroll record (Admin)
- `GET /api/payroll/my-records` - Get my payroll records
- `GET /api/payroll/all` - Get all records (Admin)
- `GET /api/payroll/{record_id}` - Get record by ID
- `PUT /api/payroll/{record_id}` - Update record (Admin)
- `DELETE /api/payroll/{record_id}` - Delete record (Admin)
- `GET /api/payroll/user/{user_id}/latest` - Get latest payroll

## 📊 Database Schema

### Users

- id, email, hashed_password, full_name, role
- employee_id, department, position, phone, avatar
- is_active, created_at, updated_at

### Attendance Records

- id, user_id, date, check_in, check_out
- status (present/absent/late/half-day), notes
- created_at, updated_at

### Leave Requests

- id, user_id, leave_type (sick/casual/annual/unpaid)
- start_date, end_date, reason
- status (pending/approved/rejected)
- admin_notes, approved_by, created_at, updated_at

### Payroll Records

- id, user_id, month, year
- base_salary, allowances, deductions, bonus, tax, net_salary
- payment_date, payment_method, notes
- created_at, updated_at

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt
- **JWT Tokens**: Secure token generation with expiration
- **Role-Based Access**: Admin and Employee roles
- **CORS Protection**: Configured for frontend origin
- **SQL Injection Prevention**: SQLAlchemy ORM with parameterized queries

## 🧪 Testing

Create test users:

```python
# In Python shell or script
from auth import get_password_hash
from models import User, UserRole
from database import SessionLocal

db = SessionLocal()

# Create admin user
admin = User(
    email="admin@dayflow.com",
    hashed_password=get_password_hash("admin123"),
    full_name="Admin User",
    role=UserRole.ADMIN,
    employee_id="EMP001",
    department="Management",
    position="Administrator"
)

# Create employee user
employee = User(
    email="employee@dayflow.com",
    hashed_password=get_password_hash("employee123"),
    full_name="John Doe",
    role=UserRole.EMPLOYEE,
    employee_id="EMP002",
    department="Engineering",
    position="Software Developer"
)

db.add(admin)
db.add(employee)
db.commit()
```

## 🚀 Production Deployment

### 1. Update Environment Variables

```env
ENVIRONMENT=production
SECRET_KEY=<generate-strong-random-key>
DATABASE_URL=postgresql://user:pass@production-host:5432/dayflow_hrms
```

### 2. Use Production ASGI Server

```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 3. Enable HTTPS

Use reverse proxy (Nginx/Apache) with SSL certificate.

## 📝 Project Structure

```
dayflow-hrms-backend/
├── main.py                 # FastAPI application entry point
├── config.py               # Configuration and settings
├── database.py             # Database connection and session
├── models.py               # SQLAlchemy database models
├── schemas.py              # Pydantic schemas for validation
├── auth.py                 # Authentication utilities
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── alembic.ini            # Alembic configuration
├── alembic/
│   └── env.py             # Alembic environment setup
└── routers/
    ├── auth_routes.py     # Authentication endpoints
    ├── user_routes.py     # User management endpoints
    ├── attendance_routes.py  # Attendance endpoints
    ├── leave_routes.py    # Leave management endpoints
    └── payroll_routes.py  # Payroll endpoints
```

## 🤝 Integration with Frontend

The frontend Next.js app is configured to connect to this backend:

```typescript
// Frontend: services/api.ts
const API_URL = "http://localhost:8000/api";
```

Make sure:

1. Backend is running on port 8000
2. CORS is configured for `http://localhost:3000`
3. JWT tokens are stored and sent with requests

## 📄 License

MIT License

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Database ORM: [SQLAlchemy](https://www.sqlalchemy.org/)
- Authentication: [python-jose](https://github.com/mpdavis/python-jose)

---

**Made with ❤️ for modern HR teams**
