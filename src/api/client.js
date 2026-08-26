import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://blogging-app-la36.onrender.com/api",
});
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("dowit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getError = (error) =>
  error.response?.data?.error || "Something went wrong. Please try again.";
export default client;
