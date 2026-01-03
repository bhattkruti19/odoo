# Employee Onboarding Flow

## Overview

The system uses a **two-step pre-approval workflow** to ensure only authorized employees can register accounts.

## Architecture

### 1. Database Tables

- **MasterEmployee**: Pre-approval list managed by admins

  - `employee_id`: Unique identifier (EMP001, etc.)
  - `work_email`: Company email
  - `role`: admin or employee
  - `is_registered`: Boolean flag (False until employee signs up)

- **User**: Actual user accounts
  - `master_employee_id`: Foreign key to MasterEmployee
  - `email`: Same as work_email
  - `hashed_password`: User's password
  - `full_name`: Derived from system or profile data
  - `role`: Same as MasterEmployee.role

### 2. Workflow Stages

#### Stage 1: Admin Pre-Approval (Add to Master List)

**UI Location**: Admin Dashboard → Employees → "Add to Master List" button

**Process**:

1. Admin fills form with:
   - Employee ID (e.g., EMP001)
   - Work Email (e.g., john@company.com)
   - Role (admin or employee)
2. Click "Add to Master List"
3. Frontend POSTs to `/api/master-employees`
4. Backend creates/updates MasterEmployee record with `is_registered=False`
5. Success: Toast notification "Employee added to master list! They can now sign up."

**Current Implementation**:

- Component: [AddEmployeeDialog.tsx](components/dialogs/AddEmployeeDialog.tsx)
- Endpoint: `POST /api/master-employees` (requires admin token)
- Backend Route: [master_employee_routes.py](../dayflow-hrms-backend/routers/master_employee_routes.py)

#### Stage 2: Employee Self-Sign-Up

**UI Location**: Public sign-up page (⚠️ NOT YET IMPLEMENTED)

**Process**:

1. Employee visits `/signup` page
2. Enters:
   - Employee ID (from master list)
   - Work Email (from master list)
   - Password (creates their account)
3. Click "Sign Up"
4. Frontend POSTs to `/auth/register`
5. Backend validates:
   - Check if Employee_ID + Email exist in MasterEmployee ✓
   - Check if `is_registered` is False ✓
   - Create User account ✓
   - Set MasterEmployee.`is_registered=True` ✓
6. Success: Redirect to login
7. Error: Show helpful message if not in master list or already registered

**Current Implementation**:

- Endpoint: `POST /auth/register` (public, validates against MasterEmployee)
- Backend Logic: [auth_routes.py](../dayflow-hrms-backend/routers/auth_routes.py) register endpoint
- Frontend: ⚠️ **MISSING** - Need to create `/signup` page

### 3. API Endpoints

#### Add to Master List (Admin Only)

```
POST /api/master-employees
Headers: Authorization: Bearer <admin_token>

Request Body:
{
  "work_email": "john@company.com",
  "employee_id": "EMP001",
  "role": "employee"
}

Response Success (200):
{
  "employee_id": "EMP001",
  "work_email": "john@company.com",
  "role": "employee",
  "is_registered": false
}

Response Error (400):
{
  "detail": "Employee ID already in use"
}
```

#### Self-Sign-Up (Public)

```
POST /auth/register
No authorization required

Request Body:
{
  "employee_id": "EMP001",
  "email": "john@company.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}

Response Success (200):
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "user": {
    "id": 25,
    "email": "john@company.com",
    "full_name": "John Doe",
    "role": "employee"
  }
}

Response Errors (400):
- "Employee ID and email not found in master list"
- "Employee already registered"
```

## Current Status

### ✅ Completed

- MasterEmployee table with `is_registered` field
- `/auth/register` validates against MasterEmployee
- `/api/master-employees` endpoint for admin pre-approval
- Admin authentication (`get_current_admin_user` dependency)
- AddEmployeeDialog component updated to use `/api/master-employees`
- Employee list page shows "Add to Master List" button
- 20 employees already seeded in master list

### ⚠️ Not Yet Implemented

1. **Employee Sign-Up Page** (`/signup`)

   - Form with Employee ID + Email + Password
   - Validates against MasterEmployee
   - Shows clear errors if not pre-approved
   - Redirects to login on success

2. **Bulk CSV/Excel Import** (Enhancement)
   - Admin feature to batch-upload employees
   - File upload on employee management page
   - Parse CSV/Excel with columns: employee_id, work_email, role
   - Bulk insert to MasterEmployee
   - Error handling and success reporting

## Testing the Flow

### Prerequisites

- Admin account created (already have 6 admins in seeded DB)
- Admin logged in to dashboard

### Test Steps

1. Go to Admin → Employees
2. Click "Add to Master List" button
3. Fill form:
   - Employee ID: `EMP999`
   - Email: `test@company.com`
   - Role: `employee`
4. Click "Save"
5. See success toast: "Employee added to master list! They can now sign up."
6. (Future) Employee goes to `/signup` page
7. (Future) Employee enters EMP999 + test@company.com + password
8. (Future) Employee successfully signs up and is redirected to login

## Error Handling

| Scenario                    | Error                                            | Current Behavior            |
| --------------------------- | ------------------------------------------------ | --------------------------- |
| Duplicate Employee ID       | "Employee ID already exists"                     | Toast error on admin dialog |
| Duplicate Work Email        | "Work email already exists"                      | Toast error on admin dialog |
| (Future) Not in master list | "Employee ID and email not found in master list" | Should show on sign-up form |
| (Future) Already registered | "Employee already registered"                    | Should show on sign-up form |

## Files to Create/Modify

### Next Steps (Recommended Order)

1. Create `/app/signup/page.tsx` - Employee self-registration form
2. Add bulk import to admin employees page
3. Update documentation/help text in UI

---

**Last Updated**: When AddEmployeeDialog was refactored to use pre-approval system
