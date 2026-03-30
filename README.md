# 🐔 AgriPoultry Order Management System

<div align="center">

**A full-stack digital platform that streamlines the poultry supply chain — connecting Farmers, Distributors, and Companies through a unified web dashboard and powerful REST API.**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://adoptium.net)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Database Setup](#2-database-setup)
  - [3. Backend (Spring Boot)](#3-backend-spring-boot)
  - [4. Frontend (React Dashboard)](#4-frontend-react-dashboard)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Demo Credentials](#-demo-credentials)
- [Screenshots](#-screenshots)
- [Team](#-team)
- [License](#-license)

---

## ✨ Features

| Module | Highlights |
|--------|-----------|
| **🧑‍🌾 Farmer Portal** | Place orders, view order history & status, make payments, profile management |
| **🚚 Distributor Dashboard** | Manage farmer orders, bulk purchasing from company, inventory & ledger, margin tracking, Kanban fulfillment board |
| **🏢 Company Dashboard** | Process distributor orders, product catalog (CRUD), financial tracking, live order feed |
| **🔐 Authentication** | Role-based login (username or phone), case-sensitive password verification, registration for all roles |
| **💰 Financial Engine** | Multi-level pricing (company → distributor → farmer), payment tracking, auto-generated ledger entries |
| **📊 Analytics** | Real-time dashboards with Recharts, revenue trends, order statistics, payment breakdowns |
| **🎨 Modern UI** | Dark/light theme toggle, responsive glassmorphism design, smooth Framer Motion animations |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│           (Vite + Tailwind + Zustand Store)              │
│                   Port: 5173                            │
└──────────────────────┬──────────────────────────────────┘
                       │  /api/* (proxied)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                Spring Boot Backend                      │
│        (REST Controllers + JPA Services)                │
│                   Port: 8085                            │
└──────────────────────┬──────────────────────────────────┘
                       │  JDBC
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    MySQL 8.x                            │
│               Database: AGRI_POULTRY                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Backend
| Component | Technology |
|-----------|-----------|
| **Framework** | Spring Boot 3.5 |
| **Language** | Java 17 |
| **ORM** | Spring Data JPA / Hibernate |
| **Database** | MySQL 8.x |
| **Build Tool** | Maven (wrapper included) |
| **Utilities** | Lombok, Bean Validation |

### Frontend
| Component | Technology |
|-----------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 3 |
| **State Management** | Zustand 5 |
| **Charts** | Recharts 3 |
| **Animations** | Framer Motion 12 |
| **Routing** | React Router DOM 7 |
| **Icons** | Lucide React |
| **Drag & Drop** | @hello-pangea/dnd |

---

## 📁 Project Structure

```
AgriPoultry-Order-Management-System/
│
├── Backend/                          # Spring Boot REST API
│   ├── src/main/java/com/agripoultry/
│   │   ├── AgriPoultryApplication.java
│   │   ├── config/                   # CORS & app configuration
│   │   ├── controller/               # REST controllers
│   │   │   ├── AuthController        #   POST /api/auth/login
│   │   │   ├── UserController        #   CRUD /api/users
│   │   │   ├── ProductController     #   CRUD /api/products
│   │   │   ├── SaleController        #   /api/sales
│   │   │   ├── PurchaseController    #   /api/purchases
│   │   │   ├── PaymentController     #   /api/payments
│   │   │   ├── LedgerController      #   /api/ledger
│   │   │   ├── BulkOrderController   #   /api/bulk-orders
│   │   │   ├── FarmerOrderController #   /api/farmer-orders
│   │   │   ├── FarmerPortalOrder...  #   /api/farmer-portal/orders
│   │   │   ├── InvoiceController     #   /api/invoices
│   │   │   ├── NotificationController#   /api/notifications
│   │   │   └── TransactionController #   /api/transactions
│   │   ├── dto/                      # Data transfer objects
│   │   ├── entity/                   # JPA entities (15 models)
│   │   ├── exception/                # Custom exception handling
│   │   ├── repository/               # Spring Data repositories
│   │   └── service/                  # Business logic layer
│   ├── src/main/resources/
│   │   ├── application.properties    # Common config (port 8085)
│   │   └── application-mysql.properties
│   ├── pom.xml
│   └── mvnw / mvnw.cmd              # Maven wrapper
│
├── Frontend/                         # React SPA
│   ├── src/
│   │   ├── App.jsx                   # Root app with routing
│   │   ├── main.jsx                  # Entry point
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx   # Shared sidebar + nav layout
│   │   │   └── farmer/              # Farmer-specific components
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Multi-role login
│   │   │   ├── Register.jsx          # Distributor/Company registration
│   │   │   ├── ForgotPassword.jsx    # Password recovery
│   │   │   ├── CompanyDashboard.jsx  # Company analytics & orders
│   │   │   ├── DistributorDashboard.jsx
│   │   │   ├── DistributorLedger.jsx # Financial ledger view
│   │   │   ├── FarmerOrders.jsx      # Distributor manages farmer orders
│   │   │   ├── BulkOrdering.jsx      # Distributor → Company orders
│   │   │   ├── KanbanFulfillment.jsx # Drag-and-drop order fulfillment
│   │   │   ├── ProductMaster.jsx     # Company product catalog
│   │   │   ├── Ledger.jsx            # Company ledger
│   │   │   ├── Settings.jsx          # Account settings
│   │   │   ├── NotFound.jsx          # 404 page
│   │   │   └── farmer/
│   │   │       ├── FarmerDashboard.jsx
│   │   │       ├── FarmerPlaceOrder.jsx
│   │   │       ├── FarmerMyOrders.jsx
│   │   │       ├── FarmerProfile.jsx
│   │   │       ├── FarmerSettings.jsx
│   │   │       ├── FarmerRegister.jsx
│   │   │       └── FarmerForgotPassword.jsx
│   │   ├── context/                  # Auth & Toast providers
│   │   ├── contexts/                 # Theme provider
│   │   ├── lib/
│   │   │   ├── api.js                # Axios/fetch API client
│   │   │   └── store.js              # Zustand global store
│   │   ├── data/mockData.js          # Seed/fallback data
│   │   └── utils/                    # Helpers & export utilities
│   ├── index.html
│   ├── vite.config.js                # Dev proxy → localhost:8085
│   ├── tailwind.config.js
│   └── package.json
│
├── schema.sql                        # Full MySQL schema dump
├── LICENSE                           # MIT License
└── README.md
```

---

## 📋 Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| **Java** | 17+ | [adoptium.net](https://adoptium.net) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **npm** | 9+ | Comes with Node.js |
| **MySQL** | 8.x | [mysql.com](https://dev.mysql.com/downloads/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

> **Note:** Maven is **not** required — the project includes a Maven wrapper (`mvnw` / `mvnw.cmd`).

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vaibhav7549/AgriPoultry-Order-Management-System.git
cd AgriPoultry-Order-Management-System
```

---

### 2. Database Setup

1. Start your MySQL server.
2. Create the database (optional — the app creates it automatically):

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS AGRI_POULTRY;"
```

3. *(Optional)* To pre-load the full schema with tables:

```bash
mysql -u root -p AGRI_POULTRY < schema.sql
```

> Hibernate `ddl-auto=update` will create/update tables automatically on startup if you skip this step.

---

### 3. Backend (Spring Boot)

```bash
# Navigate to the Backend directory
cd Backend

# Configure MySQL credentials (choose one method):

# Method A — Edit the properties file:
#   Backend/src/main/resources/application-mysql.properties
#   Change DB_USERNAME / DB_PASSWORD defaults

# Method B — Set environment variables:
export DB_USERNAME=root
export DB_PASSWORD=your_password

# Run the backend (Maven wrapper — no install needed)
./mvnw spring-boot:run        # Linux / macOS / Git Bash
mvnw.cmd spring-boot:run      # Windows CMD / PowerShell
```

**Verify:** Open http://localhost:8085/api/users — you should see `[]` (empty array).

> ⚠️ **Never commit your MySQL credentials.** Use environment variables or a local properties override.

---

### 4. Frontend (React Dashboard)

```bash
# Navigate to the Frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at **http://localhost:5173**.

All `/api` requests are automatically proxied to `http://localhost:8085` via Vite's dev proxy.

#### Other useful commands

```bash
npm run build       # Production build
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

---

## 📡 API Reference

The backend exposes the following REST endpoints on port **8085**:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Authenticate user (username/phone + password) |
| `GET/POST` | `/api/users` | List all users / Create User |
| `GET/PUT/DELETE` | `/api/users/{id}` | Get / Update / Delete user |
| `GET` | `/api/users/role/{role}` | List users by role |
| `GET/POST` | `/api/products` | List / Create products |
| `PUT/DELETE` | `/api/products/{id}` | Update / Delete product |
| `GET/POST` | `/api/sales` | List / Create sales |
| `GET/POST` | `/api/purchases` | List / Create purchases |
| `POST` | `/api/payments` | Record a payment |
| `GET` | `/api/ledger/user/{id}` | Get ledger entries for a user |
| `GET/POST` | `/api/bulk-orders` | List / Create bulk orders |
| `GET/POST` | `/api/farmer-orders` | List / Create farmer orders |
| `GET/POST` | `/api/farmer-portal/orders` | Farmer self-service orders |
| `GET` | `/api/notifications/{userId}` | Get user notifications |
| `GET` | `/api/transactions/{userId}` | Get user transactions |

> Full request/response details can be explored via the controller source files in `Backend/src/main/java/com/agripoultry/controller/`.

---

## 🗄 Database Schema

The `AGRI_POULTRY` database contains the following tables:

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│      users       │     │    products       │     │   notifications  │
│──────────────────│     │──────────────────│     │──────────────────│
│ user_id (PK)     │     │ product_id (PK)  │     │ notification_id  │
│ name             │     │ product_name     │     │ user_id (FK)     │
│ username         │     │ type (FEED/CHICK)│     │ message          │
│ phone (UNIQUE)   │     │ distributor_price│     │ read             │
│ password         │     │ company_price    │     │ created_at       │
│ role             │     └──────────────────┘     └──────────────────┘
│ address          │
└──────┬───────────┘
       │
       │ referenced by
       ▼
┌──────────────┐    ┌──────────────┐    ┌───────────────────┐
│    sales     │    │  purchases   │    │  farmer_payments   │
│──────────────│    │──────────────│    │───────────────────│
│ sale_id (PK) │    │ purchase_id  │    │ payment_id (PK)   │
│ farmer_id FK │    │ distributor  │    │ farmer_id (FK)    │
│ distributor  │    │ company_id   │    │ distributor_id    │
│ total_amount │    │ total_amount │    │ sale_id (FK)      │
│ paid_amount  │    │ paid_amount  │    │ amount_paid       │
│ due_amount   │    │ due_amount   │    │ payment_method    │
│ status       │    └──────────────┘    │ remaining_due     │
│ sale_date    │                        └───────────────────┘
└──────┬───────┘
       │
       ▼
┌──────────────┐    ┌──────────────────┐
│  sale_items  │    │     ledger       │
│──────────────│    │──────────────────│
│ sale_item_id │    │ ledger_id (PK)   │
│ sale_id (FK) │    │ user_id (FK)     │
│ product_id   │    │ type (CR/DR)     │
│ quantity     │    │ reference_type   │
│ price        │    │ reference_id     │
│ subtotal     │    │ amount           │
└──────────────┘    │ balance          │
                    └──────────────────┘
```

---

## 🔐 Demo Credentials

The app uses real authentication via the backend's `/api/auth/login` endpoint.

- Login supports **username** or **10-digit phone number**
- Passwords are checked **case-sensitively**
- "Remember me" is handled on the frontend via `localStorage`

### 👨‍🌾 Farmer Portal

| Username | Password |
|:---------|:---------|
| `ramu_kaka` | `ramu@123` |
| `suresh_patil` | `suresh@123` |
| `anita_more` | `anita@123` |

### 🚚 Distributor Portal

| Username | Password |
|:---------|:---------|
| `demo_distributor` | `dist@123` |
| `ravi_dist` | `ravi@123` |
| `city_hatch` | `city@123` |

### 🏢 Company Portal

| Username | Password |
|:---------|:---------|
| `agripoultry_corp` | `admin@123` |
| `poultry_manager` | `manager@123` |

---

## 📸 Screenshots

> _Screenshots coming soon._

<!-- 
Add screenshots here using:
![Dashboard](screenshots/dashboard.png)
-->

---

## 👥 Team

| Name | Roll No |
|------|---------|
| Ahaan Dhar | 246109020 |
| Sharvaj Sandeep Fulgaonkar | 246109030 |
| Vaibhav Krishna Chaudhari | 246109002 |

**Department of Information Technology, Walchand College of Engineering, Sangli**
2025-26

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for the poultry industry</p>
