🔐 Identity Access Service
A production-style Spring Boot Identity & Access Management (IAM) service that implements secure authentication and role-based authorization using JWT.
This project demonstrates real-world backend security architecture, token-based authentication, RBAC design, and clean layered application structure.

🚀 Why I Built This
I built this project to strengthen my understanding of:
Spring Security internals
JWT authentication flow
Role & permission modeling in relational databases
Secure API development best practices
The goal was to simulate how authentication and authorization systems are designed in real enterprise applications.

🧠 What This Project Demonstrates
✅ Secure REST API design
✅ JWT authentication implemented from scratch
✅ Custom Spring Security configuration
✅ Role-Based Access Control (RBAC)
✅ Permission-based authorization
✅ BCrypt password hashing
✅ Layered backend architecture
✅ Database seeding for default roles & permissions

🛠 Tech Stack
Java 17
Spring Boot
Spring Security
JWT (JSON Web Tokens)
JPA / Hibernate
Maven
H2 (configurable for PostgreSQL/MySQL)

🏗 Architecture
The project follows a clean layered structure:
Controller → Service → Repository → Database
Security Layer handles:
JWT validation
Authentication filtering
Authorization rules
Entities:
AppUser
Role
Permission
Roles map to multiple permissions, and users can have multiple roles.

🔐 Authentication Flow
User registers or logs in.
Credentials are authenticated.
JWT token is generated and returned.
Client includes token in request header:
Authorization: Bearer <JWT_TOKEN>
Custom JWT filter validates token.
Access is granted based on assigned roles & permissions.

📌 Sample Endpoints
Authentication
POST /auth/register
POST /auth/login
User Endpoint (Authenticated Required)
GET /users
Admin Endpoint (ADMIN Role Required)
GET /admin
⚙️ Running Locally
mvn clean install
mvn spring-boot:run

🔮 Future Improvements
Refresh token support
Swagger/OpenAPI documentation
Docker containerization
OAuth2 / Social login
Production database configuration
