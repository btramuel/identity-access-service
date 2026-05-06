# Identity Access Service

A small IAM backend. Users can sign up, log in, and hit protected routes that check their role.

## What it's built with

Node, Express, Postgres, and Prisma. JWTs for auth, bcrypt for passwords. Zod for input validation, and express rate limit on the login route.

## What's in it

- Users — register and log in, get a JWT back
- Roles — `ROLE_USER` and `ROLE_ADMIN`, attached to users in the database
- Permissions — `USER_READ`, `ADMIN_READ`, `ADMIN_WRITE`, attached to roles
- Protected routes — check the JWT first, then check the role if needed
- Rate limiting — login is capped at 5 tries per 15 minutes so it can't be brute-forced

## How auth works

You register or log in, the server hands back a signed JWT, and you put it on every later request as `Authorization: Bearer <token>`. The `requireAuth` middleware verifies the token, looks the user up fresh from the database (so revoked roles take effect right away), and sticks them on `req.user`. The `requireRole` middleware runs after that on admin-only routes.

## Endpoints

Public:
- `POST /auth/register` — make an account
- `POST /auth/login` — log in, get a token
- `POST /auth/bootstrap-admin` — one-shot to create the first admin

Logged-in:
- `GET /users` — info about the current user

Admin-only:
- `GET /admin` — admin welcome
- `GET /admin/users` — list every user

## Running it locally

You'll need Node 20+ and Postgres on your machine.

```
npm install
```

Make a `.env` file at the project root:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/iam"
JWT_SECRET="any-long-random-string"
JWT_EXPIRES_IN=3600
PORT=8080
```

Then set up the database:

```
npx prisma migrate dev --name init
npm run seed
```

And start it:

```
npm run dev
```

You'll find the API at http://localhost:8080.

## Trying it out

Register, log in, hit a protected route:

```
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"brian","email":"brian@test.com","password":"MyPassword123"}'

curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"brian","password":"MyPassword123"}'

curl http://localhost:8080/users \
  -H "Authorization: Bearer <token>"
```

To get an admin, hit `POST /auth/bootstrap-admin` once. That creates `admin1` with password `AdminPass123!`. Log in as them the same way.

## Folder layout

```
src/
  controllers/   Handle the request, hand off to a service
  services/      The actual register/login logic
  middleware/    requireAuth, requireRole, and the error handler
  routes/        Express routes, mapped to controllers
  validators/    Zod schemas for request bodies
  utils/         JWT helpers
  prisma.js      Shared Prisma client
  app.js         Express app setup
server.js        Entry point
prisma/
  schema.prisma  The data model
  seed.js        Creates the starter roles and permissions
  migrations/    Prisma migrations
```
