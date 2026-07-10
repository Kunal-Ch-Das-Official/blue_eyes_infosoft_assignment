const environment = {
BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_BASE_URL || "",
NEW_USER_REGISTRATION_URL: import.meta.env.VITE_NEW_USER_REGISTRATION_URL || "",
NEW_USER_EMAIL_VERIFICATION_URL: import.meta.env.VITE_NEW_USER_EMAIL_VERIFICATION_URL || "",

EXISTING_USER_LOGIN_URL: import.meta.env.VITE_EXISTING_USER_LOGIN_URL || "",

FETCH_LOGGED_IN_USER_URL: import.meta.env.VITE_FETCH_LOGGED_IN_USER_URL || "",
EXISTING_USER_LOGOUT_URL: import.meta.env.VITE_EXISTING_USER_LOGOUT_URL || "",
}

const envConfig = Object.freeze(environment)
export default envConfig