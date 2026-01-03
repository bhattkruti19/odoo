# 🌊 Dayflow HRMS

**Every Workday, Perfectly Aligned.**

A modern, production-grade Human Resource Management System built with Next.js 16, TypeScript, and Tailwind CSS. Features a stunning UI with parallax effects, smooth animations, and comprehensive HR functionality.

## ✨ Features

### 🎯 Core Functionality

- **Dual Portal System**: Separate interfaces for employees and administrators
- **Authentication**: Secure login/register with role-based access control
- **Real-time Updates**: Mock API integration ready for backend connection
- **Responsive Design**: Mobile-first approach with beautiful animations

### 👥 Employee Portal

- **Dashboard**: Overview of attendance, leave balance, and recent activities
- **Attendance**: Check-in/check-out with attendance history and analytics
- **Leave Management**: Apply for leave, track status, view balance
- **Payroll**: View salary breakdown and payment history
- **Profile**: Update personal information and preferences

### 👨‍💼 Admin Portal

- **Dashboard**: Organization-wide metrics and pending requests
- **Employee Management**: Complete CRUD operations with search and filters
- **Attendance Monitoring**: Real-time attendance tracking and reports
- **Leave Approval**: Review and approve/reject leave requests
- **Payroll Processing**: Manage salaries and generate payslips
- **Reports & Analytics**: Generate comprehensive reports with data visualization

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.1 (App Router) with Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📦 Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd dayflow-hrms
```

2. **Install dependencies**:

```bash
npm install
```

3. **Run the development server**:

```bash
npm run dev
```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design Features

### Color Palette

- **Admin Portal**: Indigo to Blue gradient (#6366f1 → #2563eb)
- **Employee Portal**: Emerald to Teal gradient (#10b981 → #14b8a6)

### Animation Highlights

- Parallax hero section with floating orbs
- Smooth page transitions with Framer Motion
- Interactive hover effects on cards and buttons
- Animated chart transitions
- Skeleton loading states

## 🔐 Authentication

### Demo Credentials

The application includes mock authentication for testing:

**Employee Login**:

- Email: `employee@dayflow.com`
- Password: Any password
- Role: Select "Employee"

**Admin Login**:

- Email: `admin@dayflow.com`
- Password: Any password
- Role: Select "Admin"

### Routes Protection

- `/employee/*` - Protected employee routes
- `/admin/*` - Protected admin routes
- Automatic redirection based on role

## 📁 Project Structure

```
dayflow-hrms/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin portal pages
│   ├── employee/          # Employee portal pages
│   ├── login/             # Authentication
│   ├── register/          # User registration
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/
│   ├── charts/            # Recharts visualizations
│   ├── layout/            # Navigation components
│   └── ui/                # shadcn/ui components
├── context/
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Dark mode support
├── services/
│   └── api.ts             # API service layer
├── types/
│   └── index.ts           # TypeScript interfaces
└── utils/
    └── utils.ts           # Utility functions
```

## 🔌 API Integration

The application is structured to easily connect to a backend API. All API calls are centralized in `services/api.ts`:

```typescript
// Current mock implementation
const API_URL = 'http://localhost:8000/api';

// API modules available:
- authAPI: login, register, logout
- userAPI: get, update, delete
- attendanceAPI: checkIn, checkOut, getRecords
- leaveAPI: apply, approve, reject, getRequests
- payrollAPI: get, update, generatePayslip
- reportsAPI: getStats, generateReport
```

### Environment Variables (optional)

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🎯 Key Pages

| Route                  | Description                     |
| ---------------------- | ------------------------------- |
| `/`                    | Landing page with parallax hero |
| `/login`               | User authentication             |
| `/register`            | New user registration           |
| `/employee/dashboard`  | Employee overview               |
| `/employee/attendance` | Time tracking                   |
| `/employee/leave`      | Leave management                |
| `/employee/payroll`    | Salary information              |
| `/employee/profile`    | Profile settings                |
| `/admin/dashboard`     | Admin overview                  |
| `/admin/employees`     | Employee management             |
| `/admin/attendance`    | Attendance monitoring           |
| `/admin/leave`         | Leave approval                  |
| `/admin/payroll`       | Payroll processing              |
| `/admin/reports`       | Analytics & reports             |

## 🌙 Dark Mode

Toggle between light and dark themes using the theme switcher in the navbar. Theme preference is persisted in localStorage.

## 📊 Mock Data

All pages include comprehensive mock data for demonstration:

- Employee records with avatars
- Attendance logs with check-in/out times
- Leave requests with various statuses
- Payroll information with salary breakdowns
- Activity logs and notifications
- Dashboard statistics and charts

## 🚧 Production Checklist

Before deploying to production:

- [ ] Replace mock authentication with real backend API
- [ ] Implement proper JWT token handling
- [ ] Add environment variables for API endpoints
- [ ] Set up error boundary components
- [ ] Implement proper loading states
- [ ] Add form validation error messages
- [ ] Configure CORS for API requests
- [ ] Set up analytics tracking
- [ ] Optimize images with Next.js Image component
- [ ] Add SEO meta tags
- [ ] Implement rate limiting
- [ ] Add unit and integration tests
- [ ] Configure CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

**Made with ❤️ for modern HR teams**
