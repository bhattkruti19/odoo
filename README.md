# DayFlow HRMS

A modern, full-stack Human Resource Management System built with Next.js and FastAPI.

## 🏗️ Project Structure

This project consists of two main components:

- **dayflow-hrms** - Frontend built with Next.js 15, TypeScript, and Tailwind CSS
- **dayflow-hrms-backend** - Backend API built with FastAPI and SQLAlchemy

## ✨ Features

### Admin Features

- **Dashboard**: Comprehensive overview of attendance, leave requests, and employee statistics
- **Employee Management**: Add, view, and manage employee records
- **Attendance Tracking**: Monitor daily attendance with real-time statistics
- **Leave Management**: Approve or reject leave requests
- **Payroll Management**: View and manage employee payroll
- **Reports & Analytics**: Generate insights with interactive charts

### Employee Features

- **Personal Dashboard**: Quick access to attendance, leave, and payroll information
- **Profile Management**: Edit personal information and view employment details
- **Attendance**: Check-in/check-out with time tracking
- **Leave Application**: Apply for leave and track status
- **Payroll**: View salary details and payment history

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.8+
- npm or yarn

### Frontend Setup

```bash
cd dayflow-hrms
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd dayflow-hrms-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

### Database Setup

```bash
cd dayflow-hrms-backend
python recreate_db.py
python seed.py
```

## 🔑 Default Login Credentials

### Admin Account

- Email: `admin@dayflow.com`
- Password: `admin123`

### Employee Account

- Email: `john.doe@dayflow.com`
- Password: `password123`

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Charts**: Recharts
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend

- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: SQLite (development)
- **Authentication**: JWT
- **Validation**: Pydantic
- **CORS**: FastAPI CORS middleware

## 📁 Project Structure

### Frontend (`dayflow-hrms/`)

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── employee/          # Employee pages
│   └── login/             # Authentication pages
├── components/            # Reusable components
│   ├── charts/           # Chart components
│   ├── dialogs/          # Modal dialogs
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── context/              # React contexts
├── services/             # API services
└── types/                # TypeScript types
```

### Backend (`dayflow-hrms-backend/`)

```
├── routers/              # API route handlers
│   ├── auth_routes.py
│   ├── user_routes.py
│   ├── attendance_routes.py
│   ├── leave_routes.py
│   └── payroll_routes.py
├── models.py             # Database models
├── schemas.py            # Pydantic schemas
├── auth.py               # Authentication logic
├── database.py           # Database configuration
└── main.py               # FastAPI application
```

## 🔐 Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)

```
DATABASE_URL=sqlite:///./dayflow_hrms.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📝 API Documentation

Once the backend is running, visit:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Built with ❤️ by the DayFlow team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI for the lightning-fast API framework
- shadcn for the beautiful UI components
