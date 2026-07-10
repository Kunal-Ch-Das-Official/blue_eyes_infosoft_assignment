const environment = {
backend_base_uri: import.meta.env.BACKEND_BASE_URL || "",
USER_REGISTRATION_URL: "",
USER_LOGIN_URL: "",
fetch_logged_in_user_url: ""
}

const envConfig = Object.freeze(environment)
export default envConfig