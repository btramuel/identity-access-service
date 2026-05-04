# Identity Access Service (Node.js Version)

A small Identity and Access Management (IAM) backend built with **Node.js**, **Express**, **PostgreSQL**, and **Prisma**. Users can register, log in, and reach protected routes that check their role. This is a port of my original Spring Boot version — same idea, different stack.

---

## What It Does

- Users can **register** and **log in**
- Passwords are hashed with **bcrypt** before they're saved
- A signed **JWT token** is given out on a successful login
- Protected routes need a valid token in the request header
- Access is controlled by **roles** (`ROLE_USER`, `ROLE_ADMIN`) and **permissions** (`USER_READ`, `ADMIN_READ`, `ADMIN_WRITE`)
- Login route is **rate-limited** (5 tries per 15 minutes) so people can't brute-force it

---

## How Authentication Works

```
1. User registers or logs in via /auth/register or /auth/login
2. The server checks the username and password against the database
3. A signed JWT token is sent back to the user
4. The user puts the token on every later request:

   Authorization: Bearer <your_token>

5. The requireAuth middleware grabs the token, checks it's valid,
   looks up the user, and sticks them on req.user
6. The requireRole middleware (when used) checks the user's roles
```

---

## API Endpoints

| Method | Endpoint              | Access         | Description                       |
|--------|-----------------------|----------------|-----------------------------------|
| GET    | `/`                   | Public         | Health check                      |
| POST   | `/auth/register`      | Public         | Make a new account                |
| POST   | `/auth/login`         | Public         | Log in and get a JWT              |
| POST   | `/auth/bootstrap-admin` | Public       | Create the first admin user      |
| GET    | `/users`              | Logged-in only | Get info about the current user   |
| GET    | `/admin`              | Admins only    | Admin welcome message             |
| GET    | `/admin/users`        | Admins only    | List every user in the system     |

---

## Tech Stack

| Technology       | What it's for                                      |
|------------------|----------------------------------------------------|
| Node.js          | Runtime                                            |
| Express          | Web framework                                      |
| Prisma           | Database ORM (talks to Postgres for us)            |
| PostgreSQL       | Database                                           |
| jsonwebtoken     | Making and checking JWT tokens                     |
| bcrypt           | Hashing passwords                                  |
| zod              | Checking that incoming request bodies look right   |
| express-rate-limit | Blocking too many login attempts                 |
| dotenv           | Loading config from a .env file                    |
| cors             | Letting browsers from other origins call the API   |

---

## Project Structure

```
identity-access-service/
├── prisma/
│   ├── schema.prisma       # database tables
│   └── seed.js             # creates the starter roles/permissions
├── src/
│   ├── controllers/        # handlers for each route
│   ├── services/           # the actual register/login logic
│   ├── middleware/         # requireAuth, requireRole, error handler
│   ├── routes/             # URL -> controller mappings
│   ├── utils/              # JWT helpers
│   ├── validators/         # zod schemas for incoming requests
│   ├── prisma.js           # the shared Prisma client
│   └── app.js              # Express app setup
├── server.js               # starts the server
├── .env.example            # sample config
└── package.json
```

---

## Running the Project

**1. Clone the repo and install:**
```bash
git clone https://github.com/YOUR_USERNAME/identity-access-service-node.git
cd identity-access-service-node
npm install
```

**2. Copy the example env file and fill in your values:**
```bash
cp .env.example .env
```

Then open `.env` and put in:
- A real `DATABASE_URL` (a Postgres connection string)
- A long random `JWT_SECRET` (at least 32 characters)

**3. Set up the database:**
```bash
npx prisma migrate dev --name init
npm run seed
```

The first command makes the tables. The second one fills in the starter roles and permissions.

**4. Start the server:**
```bash
npm run dev
```

The server will run at `http://localhost:8080`.

---

## Trying It Out (with curl)

**Register a new user:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"brian","email":"brian@test.com","password":"MyPassword123"}'
```

**Log in:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"brian","password":"MyPassword123"}'
```

The response will have a `token` field. Copy it.

**Hit a protected route:**
```bash
curl http://localhost:8080/users \
  -H "Authorization: Bearer <paste_your_token_here>"
```

**Make the first admin and log in as them:**
```bash
curl -X POST http://localhost:8080/auth/bootstrap-admin

curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"AdminPass123!"}'

curl http://localhost:8080/admin \
  -H "Authorization: Bearer <admin_token>"
```

---

## Why I Built This

I wanted to take my original Spring Boot IAM project and rebuild it in Node.js so I could compare the two stacks. I also wanted to get more comfortable with:

- **Prisma** for talking to the database (way less boilerplate than JPA)
- **Express middleware** as an alternative to Spring Security filters
- **JWT auth** end to end — issuing, sending, and checking tokens
- **Role-based access control (RBAC)** with hierarchical permissions
- **Rate limiting** and **input validation** as basic security extras

The two versions do the same thing, but the Node version ended up shorter and easier to follow.
# identity-access-service
