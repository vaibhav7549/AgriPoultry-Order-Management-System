# 🐔 AgriPoultry Order Management System

A digital platform to streamline and automate the ordering process of poultry feed and chicks between **Farmers**, **Distributors**, and **Companies**.

> Mini-Project I (SY-IT) — Department of Information Technology, Walchand College of Engineering, Sangli.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Users](#system-users)
- [How It Works](#how-it-works)
- [Database Schema](#database-schema)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Team](#team)

---

## Overview

Traditional poultry supply chains rely on manual phone calls and physical records, leading to errors, delays, and poor order management. **AgriPoultry OMS** replaces this with a centralized mobile application where:

- Farmers place orders for feed and chicks digitally
- Distributors aggregate farmer orders into bulk orders to the company
- Companies process and ship products directly to farmers
- Multi-level pricing and profit tracking is automated

---

## Features

- ✅ Role-based access for Farmers, Distributors, and Companies
- 📦 Order placement and bulk order management
- 💰 Multi-level pricing with distributor profit tracking
- 🔄 Real-time order status tracking (Pending → Approved → Shipped → Delivered)
- 📊 Farmer ledger and payment management (Cash / UPI / Bank)
- 🗂️ Accurate digital record keeping

---

## System Users

| Role | Responsibilities |
|------|-----------------|
| **Farmer** | Place orders for feed/chicks, track order status, make payments |
| **Distributor** | View farmer orders, place bulk orders to company, manage profit |
| **Company** | Receive bulk orders, process shipments, deliver to farmers |

---

## How It Works

```
Farmer Login → Place Order → Order sent to Distributor
                                        ↓
                              Distributor views & accepts
                                        ↓
                              Place Bulk Order to Company
                                        ↓
                              Company Processes Order
                                        ↓
                              Company Ships Product
                                        ↓
                              Product Delivered to Farmer
                                        ↓
                              Update Order Status → END
```

---

## Database Schema

The system uses a relational database with the following key tables:

- **USERS** — Stores all users with roles (Farmer / Distributor / Company)
- **PRODUCTS** — Feed and chick products with company and distributor pricing
- **SALES** — Sale bill records linked to farmers and distributors
- **SALE_ITEMS** — Line items for each sale (product, quantity, price)
- **FARMER_PAYMENTS** — Payment records per farmer (amount, method, remaining due)
- **PURCHASES** — Bulk purchase records from distributor to company
- **LEDGER** — Polymorphic credit/debit ledger linked to sales, payments, and purchases

---

## Tech Stack

> _(Update this section based on your actual implementation)_

| Layer | Technology |
|-------|-----------|
| Frontend / Mobile | _e.g. Flutter / React Native_ |
| Backend | _e.g. Node.js / Django_ |
| Database | _e.g. MySQL / PostgreSQL_ |
| Authentication | _e.g. JWT_ |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/agripoultry-oms.git

# Navigate to the project directory
cd agripoultry-oms

# Install dependencies
npm install   # or pip install -r requirements.txt

# Set up environment variables
cp .env.example .env

# Run the application
npm start     # or python manage.py runserver
```

> ⚠️ Make sure to configure your database connection in the `.env` file before running.

---

## Team

| Name | Roll No |
|------|---------|
| Ahaan Dhar | 246109020 |
| Sharvaj Sandeep Fulgaonkar | 246109030 |
| Vaibhav Krishna Chaudhari | 246109002 |

**Guide:** Mr. Varad Potdar
**Institution:** Walchand College of Engineering, Sangli — 2025-26

---

## License

This project is developed for academic purposes under Mini-Project I (SY-IT).
