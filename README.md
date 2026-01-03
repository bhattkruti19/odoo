# DayFlow HRMS

A full-stack Human Resource Management System for modern workplaces. Complete solution for attendance tracking, leave management, payroll processing, and employee management.

## Overview

DayFlow HRMS is a comprehensive HR management platform built with Next.js and FastAPI. It provides role-based interfaces for administrators and employees, real-time attendance tracking, leave request workflows, and interactive analytics.

**Structure:**

- `dayflow-hrms/` - Frontend (Next.js 15, TypeScript, Tailwind)
- `dayflow-hrms-backend/` - Backend (FastAPI, SQLAlchemy, SQLite)

## Key Features

**Admin Dashboard:**

- Real-time attendance monitoring with daily/weekly/monthly analytics
- Employee management (add, edit, view profiles)
- Leave request approval workflow with admin notes
- Payroll overview and management
- Interactive charts and reports
- Employee onboarding workflows

**Employee Portal:**

- Personal dashboard with quick statistics
- Check-in/check-out functionality
- Profile management (personal info, employment details)
- Leave application and status tracking
- Payroll information access
- Attendance records and history

## Getting Started

**Requirements:**

- Node.js 18+
- Python 3.8+
- Git

### Backend Setup

```bash
cd dayflow-hrms-backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Initialize database
python recreate_db.py
python seed.py

# Run server
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`  
API Docs: `http://localhost:8000/api/docs`

### Frontend Setup

```bash
cd dayflow-hrms

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### Default Credentials

| Role     | Email                  | Password      |
| -------- | ---------------------- | ------------- |
| Admin    | `admin@dayflow.com`    | `admin123`    |
| Employee | `john.doe@dayflow.com` | `password123` |

## Technology Stack

**Frontend**

- Next.js 15 with App Router
- React 18 with Hooks
- TypeScript for type safety
- Tailwind CSS + shadcn/ui component library
- Recharts for data visualization
- Framer Motion for animations
- Axios for HTTP requests
- Sonner for toast notifications
- Lucide React for icons

**Backend**

- FastAPI - Modern async web framework
- SQLAlchemy - SQL toolkit and ORM
- SQLite - Database (production-ready for PostgreSQL)
- Pydantic - Data validation
- JWT - Authentication & authorization
- Alembic - Database migrations
- CORS middleware for cross-origin requests

## Project Structure

```
dayflow-hrms/
├── app/
│   ├── admin/
│   │   ├── attendance/      # Attendance monitoring & analytics
│   │   ├── dashboard/       # Admin overview
│   │   ├── employees/       # Employee management
│   │   ├── leave/          # Leave request management
│   │   ├── payroll/        # Payroll administration
│   │   └── reports/        # Analytics & reports
│   ├── employee/
│   │   ├── attendance/      # Employee check-in/out
│   │   ├── dashboard/       # Personal overview
│   │   ├── leave/          # Leave applications
│   │   ├── payroll/        # Salary information
│   │   └── profile/        # Personal profile
│   ├── login/              # Authentication
│   ├── register/           # User registration
│   ├── signup/             # Signup flow
│   └── change-password-first/ # First-time password change
├── components/
│   ├── charts/             # Attendance & Payroll charts
│   ├── dialogs/            # Modal components
│   ├── layout/             # Dashboard & page layouts
│   └── ui/                 # Reusable UI components (buttons, cards, tables, etc)
├── context/
│   ├── AuthContext.tsx     # Authentication state
│   └── ThemeContext.tsx    # Theme management
├── services/
│   └── api.ts              # API client with all endpoints
├── types/
│   └── index.ts            # TypeScript interfaces
├── lib/
│   └── utils.ts            # Utility functions
└── public/                 # Static assets

dayflow-hrms-backend/
├── routers/
│   ├── auth_routes.py      # Authentication (login, password reset)
│   ├── user_routes.py      # User management endpoints
│   ├── attendance_routes.py # Check-in/out, records, stats
│   ├── leave_routes.py     # Leave requests, approvals
│   ├── payroll_routes.py   # Salary & payroll data
│   └── master_employee_routes.py # Employee master data
├── models.py               # SQLAlchemy database models
├── schemas.py              # Pydantic request/response schemas
├── auth.py                 # JWT authentication logic
├── config.py               # Configuration settings
├── database.py             # Database connection setup
├── main.py                 # FastAPI application
├── recreate_db.py          # Database initialization script
├── seed.py                 # Sample data generation
└── alembic/                # Database migrations
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/create-user` - Create new user (admin only)
- `POST /api/auth/change-password-first` - Change password on first login
- `POST /api/auth/admin/reset-password/{user_id}` - Reset user password (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/{user_id}` - Get user details
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `PUT /api/users/{user_id}` - Update user (admin only)
- `DELETE /api/users/{user_id}` - Delete user (admin only)

### Attendance
- `GET /api/attendance/all` - Get all attendance records (admin) or personal (employee)
- `GET /api/attendance/my-records` - Get personal attendance
- `GET /api/attendance/my-stats` - Get personal attendance stats
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out

### Leave
- `GET /api/leave/my-requests` - Get personal leave requests
- `GET /api/leave/all` - Get all leave requests (admin) or personal (employee)
- `POST /api/leave` - Create leave request
- `POST /api/leave/{leave_id}/approve` - Approve leave (admin only)
- `POST /api/leave/{leave_id}/reject` - Reject leave (admin only)

### Payroll
- `GET /api/payroll` - Get payroll records
- `PUT /api/payroll/{payroll_id}` - Update payroll (admin only)

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/attendance` - Attendance reports

## Environment Configuration

**Frontend** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Backend** (`.env`)
```env
DATABASE_URL=sqlite:///./dayflow_hrms.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

## Database Schema

**Key Tables:**
- `users` - User accounts and profiles
- `attendance_records` - Daily check-in/check-out logs
- `leave_requests` - Leave applications with status
- `payroll_records` - Salary and compensation data

All tables are automatically created via SQLAlchemy models.

## API Documentation

Once backend is running, access interactive API documentation:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## Development Workflow

### Frontend Development
- File-based routing in `app/` directory
- Reusable components in `components/`
- API calls through `services/api.ts`
- Type definitions in `types/index.ts`
- Context-based state management

### Backend Development
- Route handlers in `routers/`
- Database models in `models.py`
- Request/response schemas in `schemas.py`
- Authentication via JWT tokens
- Role-based access control (admin/employee)

### Database Changes
```bash
# After modifying models.py
python recreate_db.py  # Reset and recreate
python seed.py         # Re-seed with sample data
```

## Building for Production

**Frontend**
```bash
cd dayflow-hrms
npm run build
npm start
```

**Backend**
```bash
cd dayflow-hrms-backend
# Use production ASGI server
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

For production, configure:
- PostgreSQL instead of SQLite
- Environment variables properly
- HTTPS/SSL certificates
- Proper CORS origins
- Database backups

## Troubleshooting

**Backend won't start:**
- Check Python version (3.8+)
- Verify virtual environment activated
- Run `pip install -r requirements.txt`

**Frontend build errors:**
- Clear `.next` folder
- Run `npm install` again
- Check Node version (18+)

**Database issues:**
- Run `python recreate_db.py` to reset
- Check SQLite file permissions

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - See LICENSE file for details
