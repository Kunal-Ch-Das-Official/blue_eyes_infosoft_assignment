# Sports Club Management API

A TypeScript-based backend service for managing sports club athlete registrations, authentication, and admin operations. The API supports user and admin sign-in, OTP-based registration, athlete form submission with file uploads, and secure retrieval or deletion of submitted data.

## Features

- User and admin authentication with JWT cookies
- OTP-based registration and email verification
- Athlete registration workflow with profile photos and supporting documents
- Cloudinary-backed file uploads
- PostgreSQL persistence through Prisma
- Redis-backed OTP and temporary submission storage
- Health check endpoint for service readiness

## Tech Stack

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Cloudinary
- Nodemailer
- Zod

## Architecture Overview

```mermaid
flowchart TD
    A[Client] --> B[Express API]
    B --> C[Authentication Routes]
    B --> D[Athlete Registration Routes]
    C --> E[JWT Auth Middleware]
    C --> F[PostgreSQL via Prisma]
    C --> G[Redis for OTP]
    D --> H[Cloudinary Uploads]
    D --> F
    D --> G
    F --> I[Player Details / Documents / Competitions]
```

## Project Structure

- src/server.ts — Express application bootstrap
- src/routes — API route definitions
- src/controllers — Request handlers for auth and athlete flows
- src/middleware — Authorization and file upload middleware
- prisma/schema.prisma — Database schema definition
- src/services — Email, blob storage, and cookie helpers
- src/config — Environment and Cloudinary configuration

## Prerequisites

Before running the project, make sure you have:

- Node.js 18 or newer
- npm
- PostgreSQL running locally or remotely
- Redis running locally or remotely
- A Cloudinary account
- SMTP credentials for sending verification emails

## Environment Configuration

Create a .env file in the project root using the values from .env.sample.

Required variables:

```env
PORT=3000
NODE_ENVIRONMENT=development

# Prisma / PostgreSQL
DIRECT_URL=postgresql://username:password@localhost:5432/sports_club

# Redis
REDIS_URL=redis://localhost:6379

# Security
OTP_SECURITY_KEY=change-this-secret
JWT_SECRET=change-this-jwt-secret
DATA_SIGNATURE=change-this-data-signature

# Cloudinary
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# SMTP / Email
SMTP_PROTOCOL=smtp.gmail.com
SMTP_PORT=465
SMTP_SENDER=your-email@example.com
SMTP_PASS=your-app-password
```

> The application reads the PostgreSQL connection string from DIRECT_URL.

## Installation

```bash
npm install
```

## Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Run the Server

### Development mode

```bash
npm run dev
```

The server will start on http://localhost:3000 by default.

### Production build

```bash
npm run build
npm start
```

## API Endpoints

All protected routes require a valid authorization_token cookie returned after login.

### Authentication

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | /api/v1/sports-club-crm/auth/registration-init | Public | Starts registration and sends an OTP to the provided email |
| POST | /api/v1/sports-club-crm/auth/verify-otp | Public | Verifies the OTP and creates the user account |
| POST | /api/v1/sports-club-crm/auth/login-user | Public | Logs in a regular user |
| POST | /api/v1/sports-club-crm/auth/admin-login | Public | Logs in an admin user |
| GET | /api/v1/sports-club-crm/auth/user/logged-in | USER, ADMIN | Returns the current logged-in user |
| POST | /api/v1/sports-club-crm/auth/user-logout | USER, ADMIN | Clears the auth cookie and logs the user out |

### Athlete Operations

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | /api/v1/sports-club-crm/athlete-ops/form-verification | USER | Uploads profile photo and documents, validates the athlete data, and sends an email verification OTP when needed |
| POST | /api/v1/sports-club-crm/athlete-ops/submit | USER | Finalizes the athlete registration after verification |
| GET | /api/v1/sports-club-crm/athlete-ops/player-details | ADMIN | Fetches all athlete submissions |
| GET | /api/v1/sports-club-crm/athlete-ops/player-details/:id | ADMIN | Fetches a single athlete submission by ID |
| GET | /api/v1/sports-club-crm/athlete-ops/own-data | USER | Fetches submissions created by the logged-in user |
| DELETE | /api/v1/sports-club-crm/athlete-ops/remove/:id | ADMIN | Deletes an athlete submission |

### Health Check

| Method | Path | Description |
| --- | --- | --- |
| GET | /health | Verifies that the API and database are reachable |

## Typical Registration Flow

1. Send a POST request to /api/v1/sports-club-crm/auth/registration-init with fullName, emailId, password, and confirmPassword.
2. Receive the OTP in the email inbox.
3. Confirm the account with POST /api/v1/sports-club-crm/auth/verify-otp.
4. Log in with POST /api/v1/sports-club-crm/auth/login-user.
5. Submit athlete details using POST /api/v1/sports-club-crm/athlete-ops/form-verification and then POST /api/v1/sports-club-crm/athlete-ops/submit.

## Notes

- Uploaded files are validated and stored through Cloudinary.
- Temporary verification payloads are stored in Redis and expire automatically.
- The application uses cookies for session management, so browser-based clients should allow credentials.

## License

This project is licensed under the CUSTOM MIT License.
