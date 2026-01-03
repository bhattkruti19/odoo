# DayFlow HRMS

A full-stack Human Resource Management System for modern workplaces.

## Overview

DayFlow HRMS streamlines employee management, attendance tracking, leave requests, and payroll operations. Built with Next.js and FastAPI for performance and scalability.

**Structure:**

- `dayflow-hrms/` - Frontend (Next.js 15, TypeScript, Tailwind)
- `dayflow-hrms-backend/` - Backend (FastAPI, SQLAlchemy)

## Features

**For Administrators:**

- Real-time attendance monitoring and statistics
- Employee management and onboarding
- Leave request approval workflow
- Payroll overview and management
- Interactive analytics and reports

**For Employees:**

- Quick check-in/check-out
- Leave application and status tracking
- Personal profile management
- Salary and payment history access

## Quick Start

**Requirements:**

- Node.js 18 or higher
- Python 3.8 or higher

**1. Backend Setup**

```bash
cd dayflow-hrms-backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python recreate_db.py
python seed.py
uvicorn main:app --reload
```

Runs on `http://localhost:8000`

**2. Frontend Setup**

```bash
cd dayflow-hrms
npm install
npm run dev
```

Runs on `http://localhost:3000`

**3. Login**

Admin: `admin@dayflow.com` / `admin123`  
Employee: `john.doe@dayflow.com` / `password123`

## Technology Stack

**Frontend**

- Next.js 15 with TypeScript
- Tailwind CSS + shadcn/ui components
- Recharts for analytics
- Framer Motion animations
- Axios for API requests

**Backend**

- FastAPI with Pydantic validation
- SQLAlchemy ORM
- SQLite database
- JWT authentication
- RESTful API design

## Project Structure

```
dayflow-hrms/
├── app/
│   ├── admin/          # Admin dashboard & management
│   ├── employee/       # Employee portal
│   └── login/          # Authentication
├── components/
│   ├── charts/         # Data visualization
│   ├── layout/         # Page layouts
│   └── ui/             # Reusable UI components
├── context/            # Global state
└── services/           # API integration

dayflow-hrms-backend/
├── routers/
│   ├── auth_routes.py
│   ├── attendance_routes.py
│   ├── leave_routes.py
│   └── payroll_routes.py
├── models.py           # Database models
├── schemas.py          # Request/response schemas
└── main.py             # Application entry
```

## Configuration

**Frontend** (`dayflow-hrms/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`dayflow-hrms-backend/.env`)

```env
DATABASE_URL=sqlite:///./dayflow_hrms.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## API Documentation

Interactive documentation available after starting the backend:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

Contributions welcome. Fork the repo, create a feature branch, and submit a pull request.

## License

MIT License
