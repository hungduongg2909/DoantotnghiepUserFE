// src/api/httpAuth.js
import axios from "axios";

export const httpAuth = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_BE,
  withCredentials: true, // để BE set cookie session
});
