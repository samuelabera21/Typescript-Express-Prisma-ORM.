# Backend README (Express + TypeScript + Prisma)

This backend is a REST API for authentication and user profile management.

It provides:
- User registration and login
- JWT-based access control
- Refresh token flow
- Protected user profile endpoints
- Role-based authorization for admin-only actions

## 1. Tech Stack and Why Each Library Is Used

### Runtime and Core Framework
- `express`: HTTP server framework used to define routes, middleware, and request/response handling.
- `typescript`: Static typing for safer refactoring, better autocomplete, and fewer runtime bugs.
- `node` + `@types/node`: Runtime environment and type definitions for Node APIs.

### Database and ORM
- `prisma`: ORM and schema/migration tooling.
  - Why: type-safe database access and clean model-driven development.
- `@prisma/client`: Generated query client used by your app code.
- `@prisma/adapter-pg`: PostgreSQL adapter for Prisma.
  - Why: connects Prisma Client to PostgreSQL through a specific driver adapter.

### Authentication and Security
- `bcrypt`: Password hashing and verification.
  - Why: stores hash instead of plain password.
- `jsonwebtoken`: Creates and verifies JWT access/refresh tokens.
  - Why: stateless authentication for API requests.

### API Utilities
- `cors`: Enables cross-origin requests from your frontend.
- `dotenv`: Loads environment variables from `.env`.

### Development Tooling
- `nodemon`: Auto-restarts the server during local development.
- `ts-node`: Runs TypeScript directly in Node during development workflows.
- `@types/*`: TypeScript typings for external libraries (`express`, `cors`, `bcrypt`, `jsonwebtoken`).

## 2. Current Project Structure (Backend)

```text
Express/
  prisma/
    schema.prisma
  src/
    config/
      prisma.ts
    controllers/
      auth.controller.ts
      user.controller.ts
    middleware/
      auth.middleware.ts
      role.middleware.ts
    routes/
      auth.routes.ts
      user.routes.ts
    services/
      auth.service.ts
      user.service.ts
    server.ts
  package.json
  tsconfig.json
  prisma.config.ts
```

Architecture pattern in use:
- `routes`: API endpoints and route mapping
- `controllers`: HTTP layer (request parsing, response shaping)
- `services`: business logic and database interaction
- `middleware`: auth and authorization gates
- `config`: shared infrastructure setup (Prisma client)

## 3. How Authentication Works

1. User logs in with email and password.
2. Backend validates password hash with `bcrypt.compare`.
3. Backend issues:
   - Access Token (`JWT_SECRET`, expires in 15m)
   - Refresh Token (`JWT_REFRESH_SECRET`, expires in 7d)
4. Protected routes require `Authorization: Bearer <access_token>`.
5. When access token expires, client calls `/auth/refresh` with refresh token to get a new access token.

Important implementation detail:
- `authMiddleware` verifies access token and attaches decoded payload to `req.user`.
- `requireRole("admin")` checks `req.user.role` for admin-only routes.

## 4. Environment Variables

Create a `.env` file in `Express/`.

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

Notes:
- Use strong random secrets in production.
- Never commit real secrets to source control.

## 5. Database Model (Current)

From `prisma/schema.prisma`, you currently have one model:
- `users`
  - `id` (auto-increment primary key)
  - `email` (unique)
  - `password_hash`
  - `name` (optional)
  - `role` (default: `user`)
  - `created_at`
  - `updated_at`

## 6. Setup and Run (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL running and reachable

### Install dependencies
```bash
npm install
```

### Configure environment
1. Create `.env` in `Express/`.
2. Add `DATABASE_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`.

### Generate Prisma client
```bash
npx prisma generate
```

### Apply migrations (if you have migration files)
```bash
npx prisma migrate dev
```

If there are no migration files yet and DB already exists, use:
```bash
npx prisma db push
```

### Start development server
```bash
npm run dev
```

By default it runs on `http://localhost:5000` unless `PORT` is set.

## 7. Build and Production Run

### Compile TypeScript
```bash
npm run build
```

### Start compiled server
```bash
npm start
```

## 8. API Reference (Current Routes)

Base URL example: `http://localhost:5000`

### Health/Test
- `GET /`
- Response: plain text `API is running`

### Auth Routes

#### Register
- `POST /auth/register`
- Body:
```json
{
  "email": "user@example.com",
  "password": "strong-password",
  "name": "User Name"
}
```
- Behavior:
  - Fails if email already exists
  - Hashes password with bcrypt
  - Creates user in database

#### Login
- `POST /auth/login`
- Body:
```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```
- Success response includes:
  - `accessToken`
  - `refreshToken`
  - basic user data (`id`, `email`, `name`, `role`)

#### Refresh Access Token
- `POST /auth/refresh`
- Body:
```json
{
  "refreshToken": "<jwt_refresh_token>"
}
```
- Response:
```json
{
  "accessToken": "<new_access_token>"
}
```

### User Routes (Protected)

All `/user/*` routes require:
```http
Authorization: Bearer <access_token>
```

#### Get Profile
- `GET /user/profile`
- Returns selected profile fields.

#### Update Profile
- `PATCH /user/profile`
- Body (at least one field):
```json
{
  "name": "New Name",
  "email": "new@example.com"
}
```
- Fails if new email is already in use by another user.

#### Delete Own Profile
- `DELETE /user/profile`
- Deletes the authenticated user.

#### Admin Delete User by ID
- `DELETE /user/:id`
- Requires authenticated user with `role = "admin"`.

## 9. Request Flow by Layer

Example (`GET /user/profile`):
1. Route in `src/routes/user.routes.ts`
2. `authMiddleware` validates token
3. Controller (`getProfile`) extracts `userId`
4. Service (`getUserProfile`) queries Prisma
5. Controller formats JSON response

This separation keeps HTTP concerns and business/data logic cleanly split.

## 10. Current Gaps and Recommended Improvements

These are not blockers, but useful next steps:
- Add input validation (`zod` or `joi`) for request bodies.
- Add centralized error middleware for consistent error responses.
- Remove sensitive startup logs (do not print `DATABASE_URL`).
- Add refresh token rotation/revocation strategy.
- Add test suite (unit + integration with Supertest).
- Add rate limiting (`express-rate-limit`) for auth routes.

## 11. Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Prisma client generation
npx prisma generate

# DB schema sync (without migration)
npx prisma db push

# Create/apply migration
npx prisma migrate dev --name init
```
