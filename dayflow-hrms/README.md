# Dayflow HRMS

HR management system for employee and admin operations.

## Features

### Employee Portal

- **Attendance Management**: Clock in/out with automatic time tracking and working hours calculation
- **Leave Management**: Apply for sick leave, casual leave, annual leave with status tracking
- **Payroll Access**: View monthly payslips with salary breakdown, deductions, and payment history
- **Profile Management**: Update personal information, contact details, and emergency contacts
- **Dashboard**: Overview of attendance summary, pending leave requests, and recent activities

### Admin Portal

- **Employee Management**: Add, update, and manage employee records with complete profile information
- **Leave Approval System**: Review and approve/reject employee leave requests with comments
- **Payroll Processing**: Calculate and process monthly salaries with allowances and deductions
- **Attendance Monitoring**: Track employee check-in/out times and generate attendance reports
- **Analytics Dashboard**: View key metrics, attendance trends, and leave statistics
- **Report Generation**: Export attendance, leave, and payroll reports

### Technical Features

- JWT-based authentication with role-based access control
- Real-time data updates and responsive UI
- RESTful API with comprehensive documentation
- Secure password hashing and data validation
- SQLite database (easily switchable to PostgreSQL)

## Installation

### Prerequisites

- Python 3.10 or higher
- Node.js 18.x or higher
- Git

### Backend Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd dayflow-hrms
```

2. Navigate to backend directory:

```bash
cd dayflow-hrms-backend
```

3. Create and activate virtual environment:

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Initialize database with demo data:

```bash
python seed.py
```

6. Start the server:

```bash
python main.py
```

Backend runs on **http://localhost:8000**

### Frontend Setup

1. Navigate to frontend directory (in a new terminal):

```bash
cd dayflow-hrms
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Frontend runs on **http://localhost:3000**

## Login Credentials

After running `seed.py`, use these accounts:

**Admin:** dhiraj@admin.com / admin123  
**Employee:** ananya.gupta@dayflow.com / demo123

## API Documentation

Visit http://localhost:8000/docs for interactive API documentation

## Tech Stack

- Frontend: Next.js 16, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Python 3.10+
- Database: SQLite

## License

MIT
