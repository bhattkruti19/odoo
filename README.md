# 🌊 Dayflow HRMS

A modern Human Resource Management System built with Next.js 16, FastAPI, and SQLite.

## ✨ Features

- **Employee Portal**: Dashboard, Attendance, Leave, Payroll, Profile
- **Admin Portal**: Analytics, Employee Management, Leave Approval, Payroll Processing

## 🚀 Quick Start

### Backend

```bash
cd dayflow-hrms-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed.py
python main.py
```

### Frontend

```bash
cd dayflow-hrms
npm install
npm run dev
```

## 🔐 Demo Credentials

**Admin**: dhiraj@admin.com / admin123  
**Employee**: ananya.gupta@dayflow.com / demo123


### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/dayflow-hrms.git
cd dayflow-hrms
````

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd dayflow-hrms-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python recreate_db.py

# Seed demo data (optional)
python seed.py

# Start the server
python main.py
```

Backend will run on: **http://localhost:8000**

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd dayflow-hrms

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 📡 API Documentation

### Base URL

```
http://localhost:8000/api
```

### Interactive API Docs

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Authentication

All protected endpoints require a Bearer token:

```bash
Authorization: Bearer <access_token>
```

### Core Endpoints

#### Authentication

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| POST   | `/auth/login`             | User login                 |
| POST   | `/auth/admin/create-user` | Admin creates user account |
| POST   | `/auth/change-password`   | Change user password       |

#### Users

| Method | Endpoint    | Description                 |
| ------ | ----------- | --------------------------- |
| GET    | `/users/me` | Get current user profile    |
| PUT    | `/users/me` | Update current user profile |
| GET    | `/users`    | Get all users (admin only)  |

#### Attendance

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| POST   | `/attendance/check-in`   | Employee check-in          |
| POST   | `/attendance/check-out`  | Employee check-out         |
| GET    | `/attendance/my-records` | Get personal attendance    |
| GET    | `/attendance/all`        | Get all attendance (admin) |

#### Leave Management

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| POST   | `/leave`              | Create leave request           |
| GET    | `/leave/my-requests`  | Get personal leave requests    |
| GET    | `/leave/all`          | Get all leave requests (admin) |
| POST   | `/leave/{id}/approve` | Approve leave request (admin)  |
| POST   | `/leave/{id}/reject`  | Reject leave request (admin)   |

#### Payroll

| Method | Endpoint        | Description                   |
| ------ | --------------- | ----------------------------- |
| GET    | `/payroll`      | Get payroll records           |
| PUT    | `/payroll/{id}` | Update payroll record (admin) |

---

## 🔐 Demo Credentials

The system comes pre-seeded with 26 demo accounts:

### Admin Accounts

| Email                   | Password | Department |
| ----------------------- | -------- | ---------- |
| amit.sharma@dayflow.com | demo123  | HR         |
| dhiraj@admin.com        | admin123 | HR         |
| priya.singh@dayflow.com | demo123  | HR         |
| ravi.iyer@dayflow.com   | demo123  | HR         |

### Employee Accounts

| Email                    | Password | Department  |
| ------------------------ | -------- | ----------- |
| ananya.gupta@dayflow.com | demo123  | Engineering |
| rohit.verma@dayflow.com  | demo123  | Engineering |
| sneha.nair@dayflow.com   | demo123  | Engineering |
| vikram.desai@dayflow.com | demo123  | Product     |
| meera.pillai@dayflow.com | demo123  | Design      |

_See `seed.py` for complete list of demo accounts_

---

## 📁 Project Structure

### Frontend (`/dayflow-hrms`)

```
dayflow-hrms/
├── app/                       # Next.js App Router
│   ├── admin/                # Admin portal pages
│   │   ├── attendance/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── leave/
│   │   ├── payroll/
│   │   └── reports/
│   ├── employee/             # Employee portal pages
│   │   ├── attendance/
│   │   ├── dashboard/
│   │   ├── leave/
│   │   ├── payroll/
│   │   └── profile/
│   ├── login/                # Authentication
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── charts/               # Data visualizations
│   ├── dialogs/              # Modal components
│   ├── layout/               # Navigation & layout
│   └── ui/                   # shadcn/ui components
├── context/
│   ├── AuthContext.tsx       # Authentication state
│   └── ThemeContext.tsx      # Theme management
├── services/
│   └── api.ts                # API client & endpoints
├── types/
│   └── index.ts              # TypeScript interfaces
└── utils/
    └── utils.ts              # Helper functions
```

### Backend (`/dayflow-hrms-backend`)

```
dayflow-hrms-backend/
├── routers/                  # API route handlers
│   ├── auth_routes.py
│   ├── user_routes.py
│   ├── attendance_routes.py
│   ├── leave_routes.py
│   ├── payroll_routes.py
│   └── master_employee_routes.py
├── alembic/                  # Database migrations
│   └── env.py
├── __pycache__/
├── auth.py                   # Authentication logic
├── config.py                 # Configuration settings
├── database.py               # Database connection
├── models.py                 # SQLAlchemy models
├── schemas.py                # Pydantic schemas
├── main.py                   # FastAPI application
├── seed.py                   # Database seeding
├── recreate_db.py            # Database initialization
├── requirements.txt          # Python dependencies
└── alembic.ini               # Alembic configuration
```

---

## 🗄 Database Schema

### Core Tables

#### Users

- `id` (Primary Key)
- `login_id` (Unique)
- `email` (Unique)
- `full_name`
- `hashed_password`
- `role` (admin/employee)
- `employee_id`
- `department`
- `position`
- `phone`, `address`, `date_of_birth`, `emergency_contact`
- `join_date`, `salary`, `avatar`
- `must_change_password`

#### AttendanceRecord

- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `date`
- `check_in`, `check_out`
- `status` (present/absent/late/leave)
- `working_hours`

#### LeaveRequest

- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `leave_type` (sick/casual/annual/unpaid)
- `start_date`, `end_date`
- `reason`, `status`
- `admin_notes`
- `approved_by` (Foreign Key → Users)
- `created_at`, `updated_at`

#### PayrollRecord

- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `month`, `year`
- `basic_salary`, `allowances`, `deductions`
- `gross_salary`, `net_salary`, `tax`
- `payment_date`, `payment_status`

#### MasterEmployee

- Pre-approval employee registry
- Links to Users table when registered

---

## 🔒 Security Features

- ✅ **Password Hashing**: Bcrypt with salt rounds
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Role-Based Access Control**: Admin vs Employee permissions
- ✅ **CORS Protection**: Configurable allowed origins
- ✅ **SQL Injection Prevention**: SQLAlchemy ORM
- ✅ **Input Validation**: Pydantic schemas
- ✅ **Password Policies**: Minimum length requirements
- ✅ **Session Management**: Token expiration handling

---

## 🎨 Design System

### Color Palette

**Admin Portal**

- Primary: Indigo to Blue gradient (#6366f1 → #2563eb)
- Accent: Purple tones

**Employee Portal**

- Primary: Emerald to Teal gradient (#10b981 → #14b8a6)
- Accent: Green tones

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: 700 weight
- **Body**: 400 weight

### Components

- Consistent 8px spacing grid
- Rounded corners (0.5rem default)
- Subtle shadows and hover effects
- Smooth transitions (150-300ms)

---

## 🧪 Testing

### Run Frontend Tests

```bash
npm run test
```

### Run Backend Tests

```bash
pytest
```

### Manual Testing Checklist

- [ ] User authentication (login/logout)
- [ ] Employee CRUD operations
- [ ] Attendance check-in/check-out
- [ ] Leave request workflow
- [ ] Payroll calculations
- [ ] Admin approval flows
- [ ] Profile updates
- [ ] Report generation

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
npm run build
vercel --prod
```

### Backend (Railway/Render)

```bash
# Set environment variables
PYTHON_VERSION=3.10
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key

# Deploy
git push railway main
```

### Environment Variables

**Backend**

```env
DATABASE_URL=sqlite:///./dayflow_hrms.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
COMPANY_PREFIX=DF
```

**Frontend**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
