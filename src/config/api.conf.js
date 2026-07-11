import axios from "axios";
import NProgress from "`nprogress`";
import "nprogress/nprogress.css";
import envConfig from "./env.conf";


NProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.15,
});

const instance = axios.create({
  baseURL: envConfig.BACKEND_BASE_URL,
  timeout: 30000,
});

// Start loading: add "body-loading"
instance.interceptors.request.use(
  (config) => {
    NProgress.start();
    document.body.classList.add("body-loading");
    return config;
  },
  (error) => {
    document.body.classList.remove("body-loading");
    NProgress.done();
    return Promise.reject(error);
  }
);

// Stop loading: remove "body-loading"
instance.interceptors.response.use(
  (response) => {
    document.body.classList.remove("body-loading");
    NProgress.done();
    return response;
  },
  (error) => {
    document.body.classList.remove("body-loading");
    NProgress.done();
    return Promise.reject(error);
  }
);

const apiUrl = instance;
export default apiUrl;