# 🐔 AgriPoultry Order Management System

A digital platform to simplify and automate the ordering process of poultry feed and chicks between farmers, distributors, and companies.

Farmers, distributors, and companies process and deliver products all in one centralized system. A **web dashboard** (React) provides everyone with real-time analytics, order management, and financial tracking. The platform also handles multi-level pricing and tracks distributor profit automatically.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Database Setup](#2-database-setup)
  - [3. Website (React Dashboard)](#3-website-react-dashboard)
  - [4. Mobile App (Flutter)](#4-mobile-app-flutter)
- [Demo Credentials](#-demo-credentials)
- [Screenshots](#-screenshots)
- [Team](#-team)
- [License](#-license)

---

## ✨ Features

| Module | Highlights |
|--------|-----------|
| **Farmer Portal** | Place orders, view order history, make payments, dynamic pricing |
| **Distributor Dashboard** | Manage farmer orders, bulk purchasing, inventory & ledger, margin tracking |
| **Company Dashboard** | Process distributor orders, product catalog, financial tracking, live feed |
| **Database** | Multi-level pricing (distributor & farmer), payment tracking, ledger system |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Web Dashboard** | React 19 · Vite 8 · Tailwind CSS 3 · Zustand |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Database** | MySQL 8.x |

---

## 📁 Project Structure

```
AgriPoultry-Order-Management-System/
├── Website/              # React web dashboard
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page-level views
│   │   ├── context/      # React context providers
│   │   ├── data/         # Mock/seed data
│   │   ├── lib/          # Utility libraries
│   │   └── utils/        # Helper functions
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
├── schema.sql            # MySQL database schema
├── LICENSE               # MIT License
└── README.md
```

---

## 📋 Prerequisites

Make sure you have the following installed on your system:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org/) |
| **npm** | v9+ | Comes with Node.js |
| **MySQL** | 8.x | [mysql.com](https://dev.mysql.com/downloads/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

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
2. Create the database:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS AGRI_POULTRY;"
```

Hibernate will create/update tables automatically using the MySQL profile (`spring.jpa.hibernate.ddl-auto=update`).

---

### 3. Website (React Dashboard)

```bash
# Navigate to the Website directory
cd Website

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at **http://localhost:5173** (default Vite port).

Frontend proxies all `/api` calls to the backend at `http://localhost:8085`.

#### Other useful commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🔐 Demo Credentials

The app uses real authentication from the backend (`/api/auth/login`).

- Farmers can login using **username OR 10-digit phone number**
- Passwords are stored as **plaintext** (no hashing) and checked **case-sensitively**
- “Remember me” is handled on the frontend using `localStorage`

### 👨‍🌾 Farmer Portal
| Username | Password |
| :--- | :--- |
| `ramu_kaka` | `ramu@123` |
| `suresh_patil` | `suresh@123` |
| `anita_more` | `anita@123` |

### 🚚 Distributor Portal
| Username | Password |
| :--- | :--- |
| `demo_distributor` | `dist@123` |
| `ravi_dist` | `ravi@123` |
| `city_hatch` | `city@123` |

### 🏢 Company Portal
| Username | Password |
| :--- | :--- |
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

## 🚀 Backend Setup (Spring Boot)

### Prerequisites
- Java 21 (recommended) — [Download](https://adoptium.net)
- MySQL 8.x
- Maven (bundled via `./mvnw`, no install needed)

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/vaibhav7549/AgriPoultry-Order-Management-System.git
cd AgriPoultry-Order-Management-System/Backend
```

**2. Set up the database**
1. Start MySQL and create the database:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS AGRI_POULTRY;"
```

2. Tables are created/updated automatically on startup using Hibernate `ddl-auto=update` (MySQL profile).

**3. Configure MySQL credentials**
Edit `Backend/src/main/resources/application-mysql.properties` (or set env vars `DB_USERNAME` and `DB_PASSWORD`):
```properties
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:vaibhav}
```

**4. Run the backend**
```bash
./mvnw spring-boot:run
```

**5. Verify it's working**

Open browser and go to:
```
http://localhost:8085/api/users
```
You should see `[]` — empty array means connected successfully.

### ⚠️ Important
- Never commit your MySQL credentials (for example `DB_PASSWORD` / `.env` / local property overrides)
- Each teammate uses their own local MySQL credentials
- Backend runs on port `8085`, React frontend on port `5173`

If you get DB connection errors:
- Update `Backend/src/main/resources/application-mysql.properties` or set `DB_USERNAME` / `DB_PASSWORD`.
- The app runs with the MySQL profile and uses Hibernate `ddl-auto=update` to keep tables in sync.


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

This project is licensed under the **MIT License** see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for the poultry industry</p>
