# 🏢 Employee Management System (EMS)

A modern, full-stack Employee Management System built with **Vue.js 3** and **Frappe Framework**.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vuedotjs)
![Frappe](https://img.shields.io/badge/Frappe-Framework-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 🏢 Company Management

- Create, Read, Update, Delete companies
- Automatic department and employee count tracking
- Cascading delete (deletes related departments and employees)

### 🏛️ Department Management

- Create, Read, Update, Delete departments
- Link departments to companies
- Automatic employee count tracking
- Cascading delete (deletes related employees)

### 👥 Employee Management

- Create, Read, Update, Delete employees
- Link employees to companies and departments
- Employee status tracking (Application Received, Interview Scheduled, Hired, Not Accepted)
- Hire date tracking

### 🔐 Authentication & Authorization

- Token-based authentication
- Role-based access control (Admin, Manager, Employee)
- Secure login/logout
- Profile management (update name, change password)

### 📊 Dashboard

- Overview statistics (total companies, departments, employees)
- Top 5 companies by employee count chart
- Quick navigation links
- Role-based UI (different views for admin/manager vs employee)

### 📱 Responsive Design

- Mobile-first approach
- Works on desktop, tablet, and mobile devices

---

## 🛠️ Tech Stack

### Frontend

| Technology  | Purpose              |
| ----------- | -------------------- |
| Vue.js 3    | Frontend framework   |
| TypeScript  | Type-safe JavaScript |
| Pinia       | State management     |
| Vue Router  | Client-side routing  |
| TailwindCSS | Utility-first CSS    |
| Axios       | HTTP client          |
| Chart.js    | Data visualization   |
| Heroicons   | Icon library         |

### Backend

| Technology       | Purpose              |
| ---------------- | -------------------- |
| Frappe Framework | Python web framework |
| MariaDB          | Database             |
| Redis            | Caching              |
| Python 3.10+     | Server-side logic    |

---

## 📂 Project Structure

```
ems-task/
├── frontend/                    # Vue.js Frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── common/          # Shared components
│   │   │   ├── companies/       # Company-related components
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── departments/     # Department components
│   │   │   ├── employees/       # Employee components
│   │   │   └── layout/          # Layout components
│   │   ├── views/               # Page components
│   │   │   ├── account/         # Profile page
│   │   │   └── auth/            # Login page
│   │   ├── store/               # Pinia stores
│   │   ├── services/            # API services
│   │   ├── router/              # Vue Router config
│   │   └── assets/              # Static assets
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                     # Frappe Backend
    └── ems/
        └── ems/
            ├── api.py           # Custom API endpoints
            ├── hooks.py         # Frappe hooks
            └── employee_management_system/
                └── doctype/
                    ├── company/
                    ├── department/
                    └── employee/
```

---

## 📦 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **MariaDB** 10.6+
- **Redis** 6+
- **Frappe Bench** (for backend)

---

## 🚀 Installation

### Backend Setup (WSL/Linux)

1. **Install Frappe Bench:**

```bash
pip install frappe-bench
bench init frappe-bench
cd frappe-bench
```

2. **Create a new site:**

```bash
bench new-site ems.local
```

3. **Clone/Copy the EMS app:**

```bash
# Copy the backend/ems folder to apps/ems
cp -r /path/to/ems-task/backend/ems apps/
bench --site ems.local install-app ems
```

4. **Enable Server Scripts:**

```bash
bench --site ems.local set-config server_script_enabled true
```

5. **Create test users (optional):**

```bash
bench --site ems.local console
```

```python
# Create a test user
user = frappe.get_doc({
    'doctype': 'User',
    'email': 'test@example.com',
    'first_name': 'Test',
    'new_password': 'test123',
    'enabled': 1
})
user.insert(ignore_permissions=True)
frappe.db.commit()
```

### Frontend Setup (Windows/Mac/Linux)

1. **Navigate to frontend:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure API URL:**
   Edit `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: "http://localhost:8000", // Your Frappe backend URL
  // ...
});
```

---

## ▶️ Running the Application

### Start Backend (WSL/Linux)

```bash
cd ~/frappe-bench
bench start
```

Backend runs at: `http://localhost:8000`

### Start Frontend (Any Terminal)

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                                     | Description |
| ------ | -------------------------------------------- | ----------- |
| POST   | `/api/method/ems.api.login_with_credentials` | Login       |

### Companies

| Method | Endpoint                             | Description        |
| ------ | ------------------------------------ | ------------------ |
| GET    | `/api/resource/Company`              | List all companies |
| GET    | `/api/resource/Company/{id}`         | Get company by ID  |
| POST   | `/api/resource/Company`              | Create company     |
| PUT    | `/api/resource/Company/{id}`         | Update company     |
| POST   | `/api/method/ems.api.delete_company` | Delete company     |

### Departments

| Method | Endpoint                                | Description          |
| ------ | --------------------------------------- | -------------------- |
| GET    | `/api/resource/Department`              | List all departments |
| GET    | `/api/resource/Department/{id}`         | Get department by ID |
| POST   | `/api/resource/Department`              | Create department    |
| PUT    | `/api/resource/Department/{id}`         | Update department    |
| POST   | `/api/method/ems.api.delete_department` | Delete department    |

### Employees

| Method | Endpoint                              | Description        |
| ------ | ------------------------------------- | ------------------ |
| GET    | `/api/resource/Employee`              | List all employees |
| GET    | `/api/resource/Employee/{id}`         | Get employee by ID |
| POST   | `/api/resource/Employee`              | Create employee    |
| PUT    | `/api/resource/Employee/{id}`         | Update employee    |
| POST   | `/api/method/ems.api.delete_employee` | Delete employee    |

### User Profile

| Method | Endpoint                                   | Description     |
| ------ | ------------------------------------------ | --------------- |
| POST   | `/api/method/ems.api.update_user_profile`  | Update profile  |
| POST   | `/api/method/ems.api.change_user_password` | Change password |

---

## 👤 Default Users

| Email                | Password    | Role     |
| -------------------- | ----------- | -------- |
| Administrator        | admin       | Admin    |
| manager@example.com  | manager123  | Manager  |
| employee@example.com | employee123 | Employee |

---

## 🎨 Screenshots

### Dashboard

- Overview statistics with animated cards
- Top 5 companies chart
- Quick action buttons

### Companies List

- Search and filter
- Pagination
- CRUD operations

### Departments List

- Search and filter
- Company association
- Employee count display

### Employees List

- Search and filter
- Status tracking
- Full CRUD operations

### Profile Page

- Update name
- Change password
- View role

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ahmed Mahmoud**

---

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/)
- [Frappe Framework](https://frappeframework.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [Heroicons](https://heroicons.com/)
