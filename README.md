# Identity Access Service

A small IAM backend. Users can sign up, log in, and hit protected routes that check their role or permissions.

## What it's built with

Node, Express, Postgres, and Prisma. JWTs for auth, bcrypt for passwords. Zod for input validation, and express rate limit on the login and register routes.

## What's in it

- Users — register and log in, get a JWT back
- Roles — `ROLE_USER` and `ROLE_ADMIN`, attached to users in the database
- Permissions — `USER_READ`, `ADMIN_READ`, `ADMIN_WRITE`, attached to roles and checked on routes
- Protected routes — check the JWT first, then check the role or permission if needed
- Rate limiting — 5 failed logins per 15 minutes, 10 signups per hour

## How auth works

You register or log in, the server hands back a signed JWT, and you put it on every later request as `Authorization: Bearer <token>`. The `requireAuth` middleware verifies the token, looks the user up fresh from the database (so disabled accounts and revoked roles take effect right away), gathers their permissions from their roles, and sticks them on `req.user`.

After that, routes can check either:
- a role with `requireRole('ADMIN')`, or
- a permission with `requirePermission('ADMIN_READ')`

Permissions are the finer-grained option. A new role can get access to a route just by being given the right permission, without changing the route.

## Endpoints

Public:
- `POST /auth/register` — make an account
- `POST /auth/login` — log in, get a token

Logged-in:
- `GET /users` — info about the current user

Admin-only:
- `GET /admin` — admin welcome (needs `ROLE_ADMIN`)
- `GET /admin/users` — list every user (needs `ADMIN_READ`)

## Running it locally

You'll need Node 20+ and Postgres on your machine.

```
npm install
```

Copy `.env.example` to `.env` and fill it in:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/iam_db"
JWT_SECRET="<output of: openssl rand -hex 32>"
JWT_EXPIRES_IN=3600
PORT=8080
CORS_ORIGIN=""
ADMIN_USERNAME="admin"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="<pick a strong password, 12+ characters>"
```

The server won't start if `JWT_SECRET` is missing or shorter than 32 characters.

Then set up the database. The seed script makes the roles, the permissions, and your first admin from the `ADMIN_*` values:

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

To try the admin routes, log in as the admin from your `.env` the same way and use that token.

## Security notes

Things this service does on purpose:

- **No public admin endpoint.** The first admin comes from the seed script, with credentials from `.env`.
- **Same answer for a wrong username and a wrong password** ("Invalid credentials"), and both take the same time, since bcrypt runs against a dummy hash when the user doesn't exist. That way nobody can find real usernames by reading the error or timing the response.
- **Disabled accounts are only reported after the password is right**, so you can't find out an account is disabled without knowing its password.
- **Passwords are capped at 72 bytes**, which is all bcrypt actually uses.
- **Emails are lowercased**, so `Brian@test.com` and `brian@test.com` can't be two accounts.
- **Tokens only accept HS256**, and they carry the user id, not the username.
- **Proper status codes.** 401 for bad credentials, 403 for missing permissions or disabled accounts, 409 for duplicates.

Known limits:

- No logout or token revocation. A token works until it expires, but a disabled user gets blocked on their next request because every request checks the database.
- Rate limiting is per IP and kept in memory, so it resets on restart and isn't shared across multiple servers.
- `CORS_ORIGIN` left blank allows any origin. Set it before deploying anywhere.

## Folder layout

```
src/
  controllers/   Handle the request, hand off to a service
  services/      The actual register/login logic
  middleware/    requireAuth, requireRole, requirePermission, and the error handler
  routes/        Express routes, mapped to controllers
  validators/    Zod schemas for request bodies
  utils/         JWT helpers and the AppError class
  prisma.js      Shared Prisma client
  app.js         Express app setup
server.js        Entry point
prisma/
  schema.prisma  The data model
  seed.js        Creates the starter roles, permissions, and first admin
  migrations/    Prisma migrations
```
