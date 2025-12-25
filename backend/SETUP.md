# Backend Setup Guide

## Frappe Backend for EMS

This folder will contain the custom Frappe app for the Employee Management System.

## Prerequisites

- Python 3.10+
- MariaDB 10.6+
- Redis
- Node.js 18+
- Frappe Bench

## Installation Steps

### 1. Install Frappe Bench (WSL/Ubuntu)

```bash
# Install frappe-bench
sudo pip3 install frappe-bench

# Initialize bench
bench init frappe-bench --frappe-branch version-15

# Navigate to bench
cd frappe-bench
```

### 2. Create Site

```bash
# Start services
sudo service mysql start
sudo service redis-server start

# Create new site
bench new-site ems.local --admin-password admin

# Set as default
bench use ems.local
```

### 3. Create Custom App

```bash
# Create new app named 'ems'
bench new-app ems

# Install app to site
bench --site ems.local install-app ems
```

### 4. Start Development Server

```bash
# Start Frappe server
bench start
```

Server runs on: http://localhost:8000

## App Structure (After Creation)

```
backend/ems/
├── ems/
│   ├── doctype/
│   │   ├── company/
│   │   ├── department/
│   │   └── employee/
│   ├── api.py              # Custom API endpoints
│   └── hooks.py            # App configuration
├── setup.py
└── requirements.txt
```

## API Endpoints

After setup, APIs will be available at:

```
http://localhost:8000/api/resource/Company
http://localhost:8000/api/resource/Department
http://localhost:8000/api/resource/Employee
```

## Documentation

- [Frappe Framework Docs](https://frappeframework.com/docs)
- [Frappe Tutorial](https://frappeframework.com/docs/user/en/tutorial)

## Status

⏳ **Backend app not created yet** - Follow setup steps above
