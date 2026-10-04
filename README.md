# Northstar Leave Portal (Employee Leave Management System)

A full-stack employee leave management application built with **React, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Axios, React Hook Form, Zod** on the frontend and **Node.js, Express, Sequelize, and MySQL/SQLite** on the backend.

---

## 🚀 Key Features

### 🏢 Employee Workspace
- **Dashboard Overview**: Personalized time-of-day greeting, 4 high-level stat cards (Total Leave, Pending Requests, Approved Leaves, Rejected Leaves), and a recent leave requests overview table with quick details view.
- **My Leaves**: Filterable and searchable leave history with debounced search, status filter (All, Pending, Approved, Rejected), pagination, and read-only details modal.
- **Apply Leave**: Clean single-card form with real-time total days calculation, past-date prevention, minimum 10-character reason validation, and instant balance update.

### 🛡️ Admin Workspace
- **Admin Dashboard**: Live leave analytics with date range toggles (`Today`, `This Week`, `This Month`, `All`), pending approval counts, and quick 1-click approve/reject actions with confirmation dialogs.
- **Leave Requests Review**: Full leave requests table with date range tabs, employee search, status filter, and detailed view modal.
- **Employee Management**: Provision new employee profiles with auto-generated secure passwords.
- **Password Reset Flow**: Reset employee passwords securely with automatic generation.
- **One-Time Credentials Dialog**: Displays temporary login credentials once with 1-click copy buttons for email, password, and formatted credentials.

---

## 👥 Demo Credentials

| Role | Name | Email | Password | Designation |
| :--- | :--- | :--- | :--- | :--- |
| **HR Administrator** | Emily Turner | `emily@northstar.com` | `Admin@123` | HR Administrator |
| **Employee** | Mustafa Kamal | `mustafa@northstar.com` | `Employee@123` | Senior Software Engineer |
| **Employee** | Abbas Khan | `abbas@northstar.com` | `Employee@123` | Junior Developer |

> **Security Note**: All passwords are encrypted with `bcrypt` (10 rounds) and cannot be viewed in plain text after creation. If an employee forgets their password, the HR administrator uses the **Reset password** action in the Employee Directory to generate and share new temporary credentials.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui primitives + Inter typography
- **Server State**: TanStack Query (React Query v5)
- **Client State**: Zustand (with localStorage persistence for JWT & user profile)
- **Form Handling & Validation**: React Hook Form + Zod
- **Icons & Toast**: Lucide React + Sonner

### Backend
- **Runtime & Server**: Node.js + Express
- **Database & ORM**: Sequelize ORM with MySQL & SQLite fallback
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs password hashing
- **Layered Architecture**: `Route -> Controller -> Service -> Model -> Database`

---

## 📁 Project Structure

```
Week-12/
├── client/                     # React + Vite Frontend
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── api/                # TanStack Query mutation & query hooks
│       │   ├── authApi.jsx
│       │   ├── leaveApi.jsx
│       │   └── adminApi.jsx
│       ├── apiConfig/          # Axios instance + JWT interceptor + 401 handler
│       │   └── apiClient.js
│       ├── services/           # Plain Axios API service functions
│       │   ├── auth.service.js
│       │   ├── leave.service.js
│       │   └── admin.service.js
│       ├── components/
│       │   ├── ui/             # Reusable shadcn/ui primitives
│       │   ├── common/         # StatCard, StatusBadge, PageHeader, DataTable, Dialogs
│       │   └── app/            # Sidebar, SidebarItem, UserProfileCard
│       ├── constants/          # routes, roles, leaveTypes, statusOptions, dateRanges
│       ├── hooks/              # useDebounce hook
│       ├── layout/             # AppLayout (Responsive sidebar + Outlet)
│       ├── lib/                # utils (cn helper)
│       ├── pages/
│       │   ├── auth/Login.jsx
│       │   ├── employee/       # EmployeeDashboard, MyLeaves, ApplyLeave
│       │   └── admin/          # AdminDashboard, AdminLeaveRequests, Employees
│       ├── routes/             # AppRoutes, ProtectedRoute
│       ├── store/              # useAuthStore (Zustand)
│       ├── styles/             # index.css
│       ├── utils/              # formatDate, calcDays, initials, generatePassword
│       ├── App.jsx
│       └── main.jsx
│
└── server/                     # Node.js + Express Backend
    ├── .env
    ├── .env.example
    ├── package.json
    ├── app.js
    ├── server.js
    ├── config/                 # db.config.js, constants.js, config.json
    ├── migrations/             # Sequelize database migrations
    ├── seeders/                # Demo users & leaves seeders
    └── app/
        ├── controllers/        # auth, leave, employee controllers
        ├── middlewares/        # authJwt, role, errorHandler
        ├── models/             # index.js, user.js, leaveRequest.js
        ├── routes/             # auth, leave, employee routes
        └── utils/              # auth.service.js, leave.service.js, employee.service.js, dateRange.js
```

---

## ⚡ Setup & Installation

### 1. Backend Setup

```bash
cd server
npm install

# Setup environment variables
# Copy .env.example to .env and configure your DB details
```

#### Run Migrations and Seed Demo Data:
```bash
# Option A: Automated setup script
npm run db:setup

# Option B: Sequelize CLI
npm run db:migrate
npm run db:seed
```

#### Start the Backend Server:
```bash
# Development mode (nodemon)
npm run dev

# Production mode
npm start
```
The backend API server will run at `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd client
npm install

# Start Vite Development Server
npm run dev
```
The frontend portal will run at `http://localhost:5173`.

---

## 🔗 End-to-End Workflow Execution

1. **Sign in as Admin**:
   - Go to `http://localhost:5173/login`
   - Sign in with `emily@northstar.com` / `Admin@123`
   - Navigate to **Employees** -> click **Add Employee** -> generate password -> click **Create Employee**
   - Copy the generated email and password from the **Credentials Dialog**

2. **Sign in as New Employee**:
   - Click Logout
   - Log in using the newly created employee credentials
   - Navigate to **Apply Leave** -> select Leave Type, Start Date, End Date, Reason -> click **Submit Leave Request**
   - View your pending request in **My Leaves**

3. **Admin Approval**:
   - Log out and log back in as `emily@northstar.com`
   - Under **Dashboard (Today)** or **Leave Requests**, see the new pending application
   - Click the green check icon -> confirm **Approve**

4. **Verify Status & Balance**:
   - Log in as the employee -> the status is updated to **Approved** with updated used and remaining leave balance days.

5. **Password Reset Flow**:
   - As Admin, open **Employees** -> click **Reset Password** on the employee row -> click **Generate** -> confirm update
   - The **Credentials Dialog** opens with the newly generated password for one-time sharing.
