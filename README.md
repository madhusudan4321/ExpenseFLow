# ExpenseFlow – Expense & Budget Management System

ExpenseFlow is a full-stack personal finance application built with **Spring Boot** and **React (Vite)**. It empowers users to monitor their income, expenses, category budgets, financial analytics, and transaction logs with complete multi-tenant data isolation and secure JWT authentication.

---

## Features

- 🔐 **User Authentication**: Secure Registration, Login, Logout, JWT authentication, and BCrypt password hashing.
- 💸 **Expense Tracking**: Full CRUD management for expenses with custom amounts, descriptions, categories, payment methods (Cash, UPI, Credit Card, Debit Card, Bank Transfer, Other), and dates.
- 💵 **Income Tracking**: Full CRUD management for income streams (Salary, Freelancing, Business, Investment, Bonus, Other).
- 🏷️ **Category Management**: Default categories auto-generated upon user signup, with ability to add, edit, rename, and delete custom categories.
- 📊 **Monthly Budgets**: Set category spending limits per month/year. Real-time visual progress bars calculate spent amount, remaining balance, and usage percentage (with warning/over-budget visual indicators).
- 📈 **Financial Dashboard**: SaaS dashboard featuring real-time summary cards (Total Income, Total Expenses, Current Balance, Monthly Budget), Recharts Income vs Expense bar charts, Expense by Category pie charts, and recent transaction feeds.
- 📑 **Unified Transactions Ledger**: Filter, search, and sort all incomes and expenses by date, type, category, or amount.
- 🔒 **Data Isolation**: Robust database level scoping ensuring users can never access or modify another user's financial records.

---

## Tech Stack

### Backend
- **Java 17 / 21**
- **Spring Boot 3.2.3**
- **Spring Web**
- **Spring Data JPA**
- **Spring Security**
- **JWT (JJWT 0.11.5)**
- **MySQL Connector J**
- **Maven**

### Frontend
- **React.js 18**
- **Vite 5**
- **React Router DOM v6**
- **Axios**
- **Recharts**
- **Lucide Icons**
- **Vanilla CSS3** (Responsive, Glassmorphic Modern Dark/Light Theme)

---

## Project Structure

```
ExpenseFlow/
├── backend/
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/
│           │       └── expenseflow/
│           │           ├── ExpenseFlowApplication.java
│           │           ├── controller/
│           │           ├── service/
│           │           ├── repository/
│           │           ├── entity/
│           │           ├── dto/
│           │           ├── exception/
│           │           ├── config/
│           │           └── security/
│           └── resources/
│               └── application.properties
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       ├── utils/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
└── README.md
```

---

## Environment Variables

### Backend (`backend/src/main/resources/application.properties`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/expenseflow_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` | MySQL connection JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `root` | MySQL Database user |
| `SPRING_DATASOURCE_PASSWORD` | `root` | MySQL Database password |
| `JWT_SECRET` | `ExpenseFlowSuperSecretKeyThatIsAtLeast64BytesLong...` | Secret key for signing JWT tokens |
| `JWT_EXPIRATION_MS` | `86400000` (24 Hours) | JWT token expiration time in ms |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Allowed origin domains for CORS |

### Frontend (`frontend/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `/api` | Base REST API endpoint |

---

## How to Run Locally

### 1. Database Setup (MySQL)
Ensure MySQL server is running on port `3306`.
Create database `expenseflow_db` (Spring Boot will auto-create tables via Hibernate):
```sql
CREATE DATABASE IF NOT EXISTS expenseflow_db;
```

### 2. Backend Setup & Startup
Navigate to the `backend` directory and start the application:

**On Windows:**
```powershell
cd backend
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="YOUR_MYSQL_PASSWORD"
.\mvnw spring-boot:run
```

**On Linux / macOS:**
```bash
cd backend
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="YOUR_MYSQL_PASSWORD"
./mvnw spring-boot:run
```
The backend REST API will start on **`http://localhost:8080`**.

### 3. Frontend Setup & Startup
Navigate to the `frontend` directory, install dependencies, and run Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will start on **`http://localhost:5173`**.

---

## API Overview

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `GET /api/auth/me` - Get current authenticated user details

### Expenses
- `GET /api/expenses` - Get user's expenses
- `GET /api/expenses/{id}` - Get expense details by ID
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Income
- `GET /api/income` - Get user's income records
- `GET /api/income/{id}` - Get income record details by ID
- `POST /api/income` - Create income record
- `PUT /api/income/{id}` - Update income record
- `DELETE /api/income/{id}` - Delete income record

### Categories
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create custom category
- `PUT /api/categories/{id}` - Rename category
- `DELETE /api/categories/{id}` - Delete category

### Budgets
- `GET /api/budgets` - Get monthly budgets (optional `month` and `year` query params)
- `POST /api/budgets` - Create monthly category budget
- `PUT /api/budgets/{id}` - Update budget limit
- `DELETE /api/budgets/{id}` - Delete budget

### Dashboard & Analytics
- `GET /api/dashboard/summary` - Get aggregated financial metrics, chart data & recent transactions

---

## Deploying on Render

### 1. MySQL Database
- Provision a MySQL database instance (e.g. Aiven, Railway, or Render PostgreSQL/MySQL add-on).
- Copy the Database Host, Port, Database Name, Username, and Password.

### 2. Spring Boot Backend Web Service
- Create a **Web Service** on Render connected to your repository (`ExpenseFlow/backend`).
- Set Build Command: `./mvnw clean package -DskipTests`
- Set Start Command: `java -jar target/expenseflow-backend-0.0.1-SNAPSHOT.jar`
- Add Environment Variables:
  - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<HOST>:<PORT>/<DB_NAME>?useSSL=true`
  - `SPRING_DATASOURCE_USERNAME`: `<DB_USER>`
  - `SPRING_DATASOURCE_PASSWORD`: `<DB_PASSWORD>`
  - `JWT_SECRET`: `<RANDOM_64_CHAR_SECRET_KEY>`
  - `CORS_ALLOWED_ORIGINS`: `https://<YOUR_FRONTEND_RENDER_URL>.onrender.com`

### 3. React Frontend Static Site
- Create a **Static Site** on Render connected to your repository (`ExpenseFlow/frontend`).
- Set Build Command: `npm install && npm run build`
- Set Publish Directory: `dist`
- Add Environment Variable:
  - `VITE_API_BASE_URL`: `https://<YOUR_BACKEND_RENDER_URL>.onrender.com/api`