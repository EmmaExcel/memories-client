import axios from "axios";

export const API_URL = "https://memoriesbackend-3q24.onrender.com";

export const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// "https://memoriesbackend-3q24.onrender.com";
