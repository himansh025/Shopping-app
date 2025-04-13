import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;


const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Optional: Log requests in development
    if (import.meta.env.MODE === "development") {
      // console.log("Request:", config);
    }

    return config;
  },
  (error) => {
    // console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.MODE === "development") {
      // console.log("Response:", response);
    }

    return response;
  },
  (error) => {
    console.error("Response Error:", error);

    if (error.response && error.response.status === 401) {
      console.log("Unauthorized, redirecting to login...");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;