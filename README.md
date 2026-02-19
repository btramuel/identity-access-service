🔐 Identity Access Service
This is a Spring Boot backend project where I built a simple Identity and Access Management (IAM) system using JWT authentication.
The goal of this project was to understand how authentication and role-based authorization actually work behind the scenes in real applications.

🚀 What This Project Does
Users can register and log in
Passwords are encrypted using BCrypt
A JWT token is generated after login
Protected endpoints require a valid JWT
Access is controlled using roles (USER, ADMIN)
Roles can have permissions
This simulates how real-world backend systems manage authentication and authorization.

🧠 Why I Built It
I wanted to go deeper into:
Spring Security
JWT authentication flow
Role-based access control (RBAC)
Backend security design
Instead of just following tutorials, I structured it like a real backend service with controllers, services, repositories, and a security layer.

🛠 Tech Stack
Java 17
Spring Boot
Spring Security
JWT
JPA / Hibernate
Maven
H2 Database (can be switched to MySQL/Postgres)

🔐 How Authentication Works
User registers or logs in.
The server validates credentials.
A JWT token is returned.
The client sends the token in the header:
Authorization: Bearer <your_token>
A custom JWT filter validates the token on each request.
Access is granted based on the user’s roles and permissions.

📌 Example Endpoints
Authentication
POST /auth/register
POST /auth/login
User Endpoint (requires authentication)
GET /users
Admin Endpoint (requires ADMIN role)
GET /admin

⚙️ Running the Project
Clone the repo:
git clone https://github.com/YOUR_USERNAME/identity-access-service.git
cd identity-access-service
Build and run:
mvn clean install
mvn spring-boot:run

📈 What This Project Shows
Clean backend structure
Secure API design
JWT authentication implementation
Role and permission modeling
Understanding of Spring Security
