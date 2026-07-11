# Sports Club Management API

A Node.js + Express + TypeScript backend for managing athlete registrations, authentication, file uploads, email verification, and admin workflows for a sports club management system.

## 1. Overview

This project provides a REST API for:

- User and admin authentication
- Registration and OTP-based email verification
- Athlete form submission with profile photo and document uploads
- Admin review and status updates for athlete applications
- Exporting athlete records to Excel
- Health checks for app and database availability

## 2. Tech Stack

- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Redis
- JWT (cookie-based auth)
- Multer (multipart file upload)
- Nodemailer (email sending)
- Vitest + Supertest (testing)

## 3. Project Structure

- src/controllers: request handlers for authentication and athlete operations
- src/routes: route definitions grouped by feature
- src/middleware: auth and file upload middleware
- src/services: blob upload, email, Excel generation, and cookie helpers
- src/utils: validation, hashing, JWT helpers, and response utilities
- prisma/: Prisma schema and migrations
- tests/: Vitest test suites for utilities, controllers, middleware, and routes

## 4. Prerequisites

Before running the project, make sure you have:

- Node.js 18+ installed
- npm or yarn installed
- PostgreSQL running
- Redis running
- An SMTP service configured for OTP/email notifications

## 5. Environment Variables

Create a `.env` file in the project root with the following values:

```env
PORT=5000
NODE_ENVIRONMENT=development

# Database
DIRECT_URL=postgresql://<user>:<password>@<host>:<port>/<database>
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_key
DATA_SIGNATURE=your_data_signature
OTP_SECURITY_KEY=your_otp_security_key

# Cloudinary (for file uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMTP
SMTP_PROTOCOL=smtp
SMTP_PORT=587
SMTP_SENDER=your_email@example.com
SMTP_PASS=your_email_password
```

> The application reads these values from the environment configuration in src/config/envConfig.ts.

## 6. Installation

Clone the repository and install dependencies:

```bash
npm install
```

## 7. Database Setup

Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

If you want to open Prisma Studio:

```bash
npm run studio
```

## 8. Running the Project

### Development mode

```bash
npm run dev
```

The server starts on the port configured in `PORT` (default: `5000`).

### Production build

```bash
npm run build
npm start
```

## 9. Running Tests

Run the test suite:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## 10. API Base URL

All routes are mounted under:

```text
/api/v1/sports-club-crm
```

### Authentication routes

Base path:

```text
/api/v1/sports-club-crm/auth
```

### Athlete routes

Base path:

```text
/api/v1/sports-club-crm/athlete-ops
```

## 11. API Documentation

### 11.1 Health Check

Check whether the API and database are healthy.

- Method: GET
- Path: `/health`

Example:

```bash
curl http://localhost:8000/health
```

Response:

```json
{
  "status": "ok",
  "services": {
    "database": "up"
  }
}
```

---

### 11.2 User Registration Initialization

Start registration and send a verification OTP to the provided email.

- Method: POST
- Path: `/api/v1/sports-club-crm/auth/registration-init`

Request body:

```json
{
  "fullName": "John Doe",
  "emailId": "john@example.com",
  "password": "StrongPassword123",
  "confirmPassword": "StrongPassword123"
}
```

Optional query parameter:

```text
role=USER
```

Responses:
- `200` success: OTP sent successfully
- `400` invalid request
- `409` user already exists

---

### 11.3 Verify Registration OTP

Complete registration with the OTP sent by email.

- Method: POST
- Path: `/api/v1/sports-club-crm/auth/verify-otp`

Request body:

```json
{
  "oneTimePassword": "123456"
}
```

Responses:
- `200` user successfully registered
- `401` invalid OTP
- `400` missing OTP

---

### 11.4 User Login

- Method: POST
- Path: `/api/v1/sports-club-crm/auth/login-user`

Request body:

```json
{
  "emailId": "john@example.com",
  "password": "StrongPassword123"
}
```

On success, the server sets an auth cookie and returns a success response.

---

### 11.5 Admin Login

- Method: POST
- Path: `/api/v1/sports-club-crm/auth/admin-login`

Request body:

```json
{
  "emailId": "admin@example.com",
  "password": "AdminPassword123"
}
```

---

### 11.6 Get Logged-in User

- Method: GET
- Path: `/api/v1/sports-club-crm/auth/user/logged-in`
- Required role: USER

The request must include the `user_authorization_token` cookie.

---

### 11.7 Admin Get Logged-in User

- Method: GET
- Path: `/api/v1/sports-club-crm/auth/admin/logged-in`
- Required role: ADMIN

The request must include the `admin_authorization_token` cookie.

---

### 11.8 Logout

- Method: POST
- Path: `/api/v1/sports-club-crm/auth/user-logout`
- Required role: USER or ADMIN

The endpoint clears the current auth cookie and logs the user out.

---

### 11.9 Submit Athlete Form

Submit an athlete registration form with profile photo and supporting documents.

- Method: POST
- Path: `/api/v1/sports-club-crm/athlete-ops/submit`
- Required role: USER

This endpoint expects a multipart/form-data request.

Required form fields:
- `profile_photo`: image file
- `players_document`: one or more document files
- `playerName`
- `fathersName`
- `mothersName`
- `dateOfBirth`
- `gender`
- `emailAddress`
- `contactNumber`
- `alternateMobileNo`
- `address`
- `pinCode`
- `stateOrProvince`
- `country`
- `club`
- `sports`
- `fileTitles` (optional JSON array)
- `competitions` (optional JSON array)

Example using curl:

```bash
curl -X POST http://localhost:5000/api/v1/sports-club-crm/athlete-ops/submit \
  -H "Cookie: user_authorization_token=YOUR_TOKEN" \
  -F "profile_photo=@/path/to/photo.jpg" \
  -F "players_document=@/path/to/doc.pdf" \
  -F "playerName=Asha" \
  -F "fathersName=John" \
  -F "mothersName=Maria" \
  -F "dateOfBirth=11/07/1995" \
  -F "gender=FEMALE" \
  -F "emailAddress=asha@example.com" \
  -F "contactNumber=9876543210" \
  -F "alternateMobileNo=9876543210" \
  -F "address=Some Street" \
  -F "pinCode=123456" \
  -F "stateOrProvince=Delhi" \
  -F "country=India" \
  -F "club=Sports Club" \
  -F "sports=Cricket" \
  -F "fileTitles=[\"ID Proof\"]" \
  -F "competitions=[]"
```

---

### 11.10 Verify Athlete Email and Upload Files

Validate the athlete email and prepare the submission with uploaded files.

- Method: POST
- Path: `/api/v1/sports-club-crm/athlete-ops/form-verification`
- Required role: USER

This endpoint uploads profile photo and athlete documents, validates the payload, and stores pending verification data.

---

### 11.11 Fetch All Athlete Details (Admin)

- Method: GET
- Path: `/api/v1/sports-club-crm/athlete-ops/player-details`
- Required role: ADMIN

Returns a list of athlete registration summaries.

---

### 11.12 Fetch One Athlete Details (Admin)

- Method: GET
- Path: `/api/v1/sports-club-crm/athlete-ops/player-details/:id`
- Required role: ADMIN

Returns one athlete record with related documents and competitions.

---

### 11.13 Fetch Own Submitted Data (User)

- Method: GET
- Path: `/api/v1/sports-club-crm/athlete-ops/own-data`
- Required role: USER

Returns records submitted by the currently authenticated user.

---

### 11.14 Delete Athlete Record (Admin)

- Method: DELETE
- Path: `/api/v1/sports-club-crm/athlete-ops/remove/:id`
- Required role: ADMIN

Deletes an athlete record by ID.

---

### 11.15 Update Form Status (Admin)

- Method: POST
- Path: `/api/v1/sports-club-crm/athlete-ops/update-status`
- Required role: ADMIN

Query parameters:
- `formDataId`: athlete record ID
- `status`: `APPROVED` or `REJECTED`

Example:

```bash
curl "http://localhost:5000/api/v1/sports-club-crm/athlete-ops/update-status?formDataId=123&status=APPROVED"
```

---

### 11.16 Export Athletes to Excel

- Method: GET
- Path: `/api/v1/sports-club-crm/athlete-ops/export-data`
- Required role: ADMIN

Downloads an Excel workbook containing athlete data.

## 12. Authentication Notes

The API uses cookie-based JWT authentication.

Cookies used by the server:
- `user_authorization_token`
- `admin_authorization_token`

Make sure your client sends cookies with cross-site requests when required.

## 13. Response Format

Most endpoints return a JSON object with a standard structure similar to:

```json
{
  "message": "Successful!",
  "statusCode": 200,
  "details": "Operation completed successfully"
}
```

Error responses also follow a consistent pattern:

```json
{
  "message": "Bad Request!",
  "statusCode": 400,
  "details": "Validation failed"
}
```

## 14. Testing Notes

The project includes tests for:

- Utility functions
- Middleware
- Controllers
- Routes

To run them:

```bash
npm test
```

## 15. Troubleshooting

- If Prisma throws a database connection error, verify PostgreSQL is running and `DIRECT_URL` is correct.
- If Redis-related features fail, verify Redis is running and `REDIS_URL` is correct.
- If mail verification does not send, verify SMTP credentials and the `SMTP_*` variables.
- If uploads fail, verify your Cloudinary credentials and the upload service configuration.

## 16. License

This project is licensed under MIT.
