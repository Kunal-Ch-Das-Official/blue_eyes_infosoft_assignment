# Sports Club Management Admin

A modern admin dashboard for managing athlete registration applications, reviewing submissions, updating application status, and exporting athlete data. This application is built as a React + Vite frontend that connects to a backend API for authentication and athlete data operations.

## Overview

This project provides a secure administrative portal for sports club staff to:

- Register and authenticate admin users
- Verify admin accounts through email OTP
- View athlete applications in a dashboard
- Search and filter athlete records
- Review full athlete details
- Approve, reject, or update application status
- Export athlete data to Excel

The UI is designed for a professional operations workflow and uses a protected-routing approach so only authenticated admins can access the dashboard.

---

## Tech Stack

### Frontend
- React 19
- Vite 8
- React Router DOM
- Tailwind CSS
- Zustand for state management
- Axios for API requests
- React Toastify for notifications
- Lucide React for icons
- NProgress for request loading feedback

### Development Tools
- ESLint
- Vite React plugin
- Babel support for React compiler optimizations

---

## Architecture

The application follows a clean frontend architecture centered around route-based pages, reusable components, and centralized API configuration.

### High-Level Flow

1. The app boots in [src/main.jsx](src/main.jsx)
2. Routing is initialized with React Router
3. Protected routes are guarded by [src/private/ProtectedRouter.jsx](src/private/ProtectedRouter.jsx)
4. Auth validation is handled through [src/hooks/useAuthValidator.jsx](src/hooks/useAuthValidator.jsx)
5. Pages interact with the backend through [src/config/api.conf.js](src/config/api.conf.js)
6. Environment-driven endpoints are configured in [src/config/env.conf.js](src/config/env.conf.js)

### Main Architectural Layers

- Presentation Layer
  - Pages under [src/pages](src/pages)
  - Reusable UI components under [src/components](src/components)
  - Shared UI helpers under [src/utils](src/utils)

- State Management
  - Auth state is stored in [src/stores/useAuthStore.js](src/stores/useAuthStore.js)
  - Signup flow state is stored in [src/stores/useSignUpDataStore.js](src/stores/useSignUpDataStore.js)

- API Layer
  - Central Axios client in [src/config/api.conf.js](src/config/api.conf.js)
  - Backend endpoint configuration in [src/config/env.conf.js](src/config/env.conf.js)

- Route Protection
  - Private routes are wrapped by [src/private/ProtectedRouter.jsx](src/private/ProtectedRouter.jsx)
  - Authentication state is verified before rendering private pages

---

## Project Structure

```text
src/
  App.jsx                  # Route definitions
  main.jsx                 # Application entry point
  assets/                  # Static assets
  components/              # Reusable UI components
    access-details/        # Athlete cards, preview, grid
    authentication/       # Sign-in, sign-up, OTP forms
  config/                  # API and env configuration
  helpers/                 # Utility helpers and validation
  hooks/                   # Custom hooks
  layout/                  # Shared layout components
  pages/                   # Route-level screens
  private/                 # Protected route logic
  stores/                  # Global state stores
  utils/                   # Modal, toast, form input helpers
```

---

## Features

### Authentication
- Admin sign-up with validation
- Email-based OTP verification
- Admin sign-in
- Protected dashboard access
- Session-based auth validation through backend cookies

### Athlete Management
- Fetch athlete applications from the backend
- Display athlete cards in a dashboard grid
- Search athlete records by name, status, phone, or age
- Open a detailed athlete preview page
- Update athlete application status
- Export athlete data to Excel

### User Experience
- Toast notifications for success and error states
- Loading indicators during network requests
- Responsive layout for dashboard and forms
- Clean and modern admin UI styling with Tailwind CSS

---

## Environment Configuration

The frontend depends on several environment variables defined in [src/config/env.conf.js](src/config/env.conf.js).

Create a `.env` file in the project root with values matching your backend API.

### Example

```env
VITE_BACKEND_BASE_URL=http://localhost:5000/api
VITE_NEW_ADMIN_REGISTRATION_URL=/admins/register
VITE_NEW_ADMIN_EMAIL_VERIFICATION_URL=/admins/verify-email
VITE_EXISTING_ADMIN_LOGIN_URL=/admins/login
VITE_FETCH_LOGGED_IN_ADMIN_URL=/admins/me
VITE_EXISTING_ADMIN_LOGOUT_URL=/admins/logout
VITE_FETCH_PLAYERS_DETAILS_URL=/players
VITE_RESPONSE_PLAYERS_URL=/players/respond
VITE_EXPORT_DATA_IN_EXCEL_URL=/players/export
```

> Replace these values with the actual routes exposed by your backend service.

### Variable Descriptions

- `VITE_BACKEND_BASE_URL`: Base URL for all backend requests
- `VITE_NEW_ADMIN_REGISTRATION_URL`: Endpoint for admin registration
- `VITE_NEW_ADMIN_EMAIL_VERIFICATION_URL`: Endpoint for OTP verification
- `VITE_EXISTING_ADMIN_LOGIN_URL`: Endpoint for admin login
- `VITE_FETCH_LOGGED_IN_ADMIN_URL`: Endpoint to check the current authenticated admin
- `VITE_EXISTING_ADMIN_LOGOUT_URL`: Endpoint for admin logout
- `VITE_FETCH_PLAYERS_DETAILS_URL`: Endpoint to fetch athlete data
- `VITE_RESPONSE_PLAYERS_URL`: Endpoint to update athlete status
- `VITE_EXPORT_DATA_IN_EXCEL_URL`: Endpoint to export athlete data as Excel

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project folder
3. Install dependencies

```bash
npm install
```

### Run Locally

Start the Vite development server:

```bash
npm run dev
```

The app should open at:

```text
http://localhost:5173
```

---

## Available Scripts

### Development

```bash
npm run dev
```
Runs the local development server with hot reloading.

### Production Build

```bash
npm run build
```
Creates a production-ready build in the `dist` folder.

### Linting

```bash
npm run lint
```
Runs ESLint to check code quality and style.

### Preview Production Build

```bash
npm run preview
```
Serves the built application locally for preview.

---

## Application Workflow

### 1. Admin Registration
- A new admin enters their full name, email, and password
- The app validates the input
- The backend receives a registration request
- The user is redirected to the OTP verification page

### 2. Email Verification
- The admin enters the 6-digit OTP received by email
- The app verifies the code against the backend
- On success, the account is activated and the admin can sign in

### 3. Admin Sign-In
- The admin signs in with email and password
- The backend authenticates the request
- On success, the user is redirected to the dashboard

### 4. Dashboard Experience
- The dashboard displays athlete applications in a card-based layout
- Users can search, refresh, or export current data
- Each card allows the admin to update application status or view full details

### 5. Athlete Details View
- Clicking “View Full Data” opens a detailed athlete record page
- This screen fetches additional player-specific information from the backend

---

## API Communication Notes

The app uses Axios with a centralized configuration layer.

### Important Behavior
- Requests are made with `withCredentials: true` for authenticated flows
- A global loading indicator appears while requests are in progress
- Toast notifications inform the user of success, errors, and warnings
- The app expects a backend service to return data in a format compatible with the frontend components

---

## Styling and UI

The UI uses Tailwind CSS and component-driven styling. The dashboard has a polished, lightweight interface with:

- Card-based layouts
- Search and action controls
- Status badges
- Modal-based confirmation flows
- Responsive spacing and typography

---

## Notes for Contributors

When contributing to this project:

- Keep components modular and focused on a single responsibility
- Reuse shared UI and helper utilities where possible
- Prefer centralized API logic rather than duplicating requests in multiple pages
- Preserve the auth-protected route behavior
- Follow existing toast and error handling patterns for consistency

---

## License

This project is distributed under the license included in the repository.
