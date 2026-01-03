# Dayflow HRMS

Full-stack HR management system with employee and admin portals.

## What it does

**For Employees:**

- Clock in/out and track attendance
- Apply for leaves
- View payslips
- Update profile

**For Admins:**

- Dashboard with analytics
- Manage employees
- Approve/reject leave requests
- Process payroll
- Generate reports

## Setup

The project has two parts - backend (Python) and frontend (Node.js).

### Backend Setup

```bash
cd dayflow-hrms-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed.py
python main.py
```

Backend runs on http://localhost:8000

### Frontend Setup

```bash
cd dayflow-hrms
npm install
npm run dev
```

Frontend runs on http://localhost:3000

## Login

After running seed.py, you can login with:

Admin account: amit.sharma@dayflow.com / demo123
Employee account: ananya.gupta@dayflow.com / demo123

There are 26 demo accounts total (check seed.py for the complete list).

## API Documentation

The backend API docs are available at http://localhost:8000/docs when the server is running.

Main endpoints:

- /api/auth/login - User authentication
- /api/users - User management
- /api/attendance - Check in/out
- /api/leave - Leave requests
- /api/payroll - Payroll records

## Tech Stack

Frontend: Next.js 16, React, TypeScript, Tailwind CSS
Backend: FastAPI, SQLAlchemy, Python 3.10+
Database: SQLite (easily switchable to PostgreSQL)

## Project Structure

```
dayflow-hrms/                  # Frontend
├── app/                       # Next.js pages
├── components/                # React components
├── services/api.ts           # API client
└── types/index.ts            # TypeScript types

dayflow-hrms-backend/          # Backend
├── routers/                   # API routes
├── models.py                  # Database models
├── schemas.py                 # Request/response schemas
├── auth.py                    # Authentication
└── main.py                    # FastAPI app
```

## License

MIT
│ Frontend (Next.js) │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │ Pages │ │ Components │ │ Services │ │
│ │ (App Dir) │ │ (UI/UX) │ │ (API) │ │
│ └────────────┘ └────────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────┘
↕ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│ Backend (FastAPI) │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │ Routers │ │ Models │ │ Schemas │ │
│ │ (Endpoints)│ │ (ORM) │ │ (Validation)│ │
│ └────────────┘ └────────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────┘
↕ SQL
┌─────────────────────────────────────────────────────────┐
│ Database (SQLite/PostgreSQL) │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │ Users │ │ Attendance │ │ Leave │ │
│ │ Payroll │ │ Master │ │ Auth │ │
│ └────────────┘ └────────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────┘

````

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.10 or higher
- **pip** or **poetry** for Python package management
- **Git** for version control

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

### Quick Start with Docker (Coming Soon)

```bash
docker-compose up -d
```

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

### Code Standards

- **Frontend**: ESLint + Prettier
- **Backend**: Black + isort
- **Commits**: Conventional Commits format
- **Testing**: Write tests for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Icon set

---

## 📞 Support

For questions or support:

- 📧 Email: support@dayflow.com
- 💬 Discord: [Join our community](https://discord.gg/dayflow)
- 📖 Documentation: [docs.dayflow.com](https://docs.dayflow.com)

---

<div align="center">

**Made with ❤️ for modern HR teams**

[⭐ Star us on GitHub](https://github.com/yourusername/dayflow-hrms) | [🐛 Report Bug](https://github.com/yourusername/dayflow-hrms/issues) | [✨ Request Feature](https://github.com/yourusername/dayflow-hrms/issues)

</div>
