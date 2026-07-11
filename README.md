# Sports Club Management Client

A React-based frontend application for managing athlete registration, authentication, document submission, and email verification for a sports club platform.

## Overview

This client app provides a guided user experience for:
- Signing up and signing in
- Completing multi-step athlete registration
- Uploading and viewing submitted documents
- Verifying new user email addresses
- Protecting authenticated pages with route guards

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Zustand for state management
- Axios for API requests
- Tailwind CSS for styling
- React Toastify for notifications
- NProgress for request loading indicators
- ESLint for linting

## Project Architecture

The application follows a feature-oriented structure centered around pages, reusable components, shared hooks, and state stores.

### Main layers
- Pages: route-level screens such as sign-in, sign-up, registration flow, verification, and documents
- Components: reusable UI for authentication, registration steps, navigation, and modals
- Hooks: custom logic for auth validation and form validation
- Stores: global state for authentication and registration data using Zustand
- Config: centralized environment and API configuration
- Utilities: shared helpers for input formatting, toast handling, and UI helpers

### Routing flow
- Public routes: sign-up, sign-in, email verification
- Protected routes: home page and my documents
- Authentication is enforced through a protected route wrapper that validates the current session before rendering private pages

### State management
- Authentication state is stored in Zustand via the auth store
- Registration flow state is managed through dedicated registration stores
- API requests use a shared Axios instance with request/response interceptors

## Project Structure

```text
src/
  App.jsx
  main.jsx
  pages/
  components/
  hooks/
  stores/
  utils/
  config/
  private/
  layout/
  assets/
```

## Prerequisites

Make sure you have the following installed on your machine:
- Node.js 18+ (recommended latest LTS)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root (or `.env.local`) and configure the required Vite environment variables.

The app expects the following variable names:

```env
VITE_BACKEND_BASE_URL=
VITE_NEW_USER_REGISTRATION_URL=
VITE_NEW_USER_EMAIL_VERIFICATION_URL=
VITE_EXISTING_USER_LOGIN_URL=
VITE_FETCH_LOGGED_IN_USER_URL=
VITE_EXISTING_USER_LOGOUT_URL=
VITE_POST_NEW_ATHLETE_DETAILS_URL=
VITE_PUSH_NEW_ATHLETE_DETAILS_TO_DB_URL=
VITE_FETCH_OWN_SUBMITTED_DOCS_URL=
```

> These values should match the backend API endpoints provided by your server or API gateway.

## Run Locally

Start the development server:

```bash
npm run dev
```

Then open the local URL shown by Vite in your browser, usually:

```text
http://localhost:5173
```

## Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Linting

Run the linter:

```bash
npm run lint
```

## Important Notes

- The app uses cookie-based authentication for protected routes. Make sure your backend is configured to set and accept authentication cookies correctly.
- Some routes depend on backend endpoints to be available and correctly configured in your environment variables.
- The registration experience is multi-step and relies on state persistence between steps.
- The project uses Vite environment variables with the `VITE_` prefix, so they must be defined before the app runs.
- If API requests fail, check the browser developer console and the configured backend base URL.

## Development Tips

- Keep shared UI components under the components folder so they can be reused across pages.
- Prefer hooks for reusable logic such as auth validation and form handling.
- Use the existing stores for cross-component state instead of introducing ad-hoc local state when the data is shared.
- Follow the current project structure when adding new pages or features to keep the codebase consistent.

## License

This project is licensed under MIT.