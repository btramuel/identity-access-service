# 🔐 Identity Access Service

A Spring Boot backend implementing a simple **Identity and Access Management (IAM)** system with JWT authentication and role-based access control (RBAC). Built to understand how authentication and authorization actually work under the hood in real-world backend applications.

---

## 🚀 What It Does

- Users can **register** and **log in**
- Passwords are securely hashed with **BCrypt**
- A signed **JWT token** is issued on successful login
- Protected routes require a valid token in the request header
- Access is controlled via **roles** (`USER`, `ADMIN`) and granular **permissions**

---

## 🔐 How Authentication Works

```
1. User registers or logs in via /auth/register or /auth/login
2. Server validates credentials against the database
3. A signed JWT token is returned to the client
4. Client sends the token on every subsequent request:

   Authorization: Bearer <your_token>

5. A custom JWT filter intercepts and validates the token
6. Access is granted or denied based on the user's roles and permissions
```

---

## 📌 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public | Create a new account |
| `POST` | `/auth/login` | Public | Log in and receive a JWT |
| `GET` | `/users` | Authenticated | Access user-level data |
| `GET` | `/admin` | ADMIN only | Access admin-level data |

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| Java 17 | Core language |
| Spring Boot | Application framework |
| Spring Security | Authentication & authorization layer |
| JWT | Stateless token-based auth |
| JPA / Hibernate | Database ORM |
| H2 Database | In-memory DB for development (swappable with MySQL/Postgres) |
| Maven | Build tool |

---

## ⚙️ Running the Project

**1. Clone the repo:**
```bash
git clone https://github.com/YOUR_USERNAME/identity-access-service.git
cd identity-access-service
```

**2. Build and run:**
```bash
mvn clean install
mvn spring-boot:run
```

The app will start at `http://localhost:8080`.

> The project uses an **H2 in-memory database** by default — no setup needed. To switch to MySQL or PostgreSQL, update `src/main/resources/application.properties` with your database credentials.

---

## 🧠 Why I Built This

Rather than just following tutorials, I wanted to properly understand the security layer that underpins most backend systems. This project gave me hands-on experience with:

- **Spring Security** configuration and filter chains
- The full **JWT authentication flow** (issue, validate, parse)
- Designing a **role-based access control (RBAC)** system
- Structuring a backend with clean separation across controllers, services, repositories, and security layers

---

## 📁 Project Structure

```
src/main/java/
├── auth/              # Registration and login logic
├── config/            # Spring Security and JWT configuration
├── controller/        # REST endpoints
├── model/             # User, Role, Permission entities
├── repository/        # Database access layer
└── service/           # Business logic
```
