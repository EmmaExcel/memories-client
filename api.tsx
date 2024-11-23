import axios from "axios";

export const API_URL = "http://localhost:8008";

export const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// "https://memoriesbackend-3q24.onrender.com";
