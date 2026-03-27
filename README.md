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
2. Create the database and import the schema:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS AGRI_POULTRY;"
mysql -u root -p AGRI_POULTRY < schema.sql
```

> **Note:** The `schema.sql` file creates all required tables — `users`, `products`, `sales`, `sale_items`, `purchases`, `ledger`, and `farmer_payments`.

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

The app currently uses dummy authentication for demonstration purposes via the `mockData.js` context state.

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
