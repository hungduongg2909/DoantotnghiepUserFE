import axios from "axios";
import queryString from "query-string";

// Set up default config for http requests here
const axiosClient = axios.create({
   baseURL: `${import.meta.env.VITE_BASE_URL_BE}/user`,
   withCredentials: true,
   paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
   // Handle token here
   const token = localStorage.getItem("access_token");
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }

   // Set content-type based on request data
   // if (config.data instanceof FormData) {
   // Để axios tự set content-type cho multipart/form-data
   // } else {
   // Set JSON cho các request thường
   // 	config.headers['content-type'] = 'application/json';
   // }

   return config;
});

axiosClient.interceptors.response.use(
   (response) => {
      if (response && response.data) {
         return response.data;
      }
      return response;
   },
   (error) => {
      // Handle errors
      if (error.response?.status === 401) {
         localStorage.removeItem("username");
         window.location.href = "/login";
      }
      if (error.response?.status === 403) {
         alert(error.response.data.message);
      }
      throw error;
   }
);

export default axiosClient;
