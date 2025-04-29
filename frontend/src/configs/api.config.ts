import axios from "axios";

const mode = import.meta.env.NODE_ENV;

export const axiosClient = axios.create({
  baseURL:
    mode === "development"
      ? import.meta.env.VITE_DEV_API_URL
      : import.meta.env.VITE_DEV_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
