// This file is a shortcut so every page doesn't have to repeat the same
// setup for talking to our backend.

import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// After logging in, we save a "token" (like a wristband). This automatically
// attaches that token to every request we make, so the backend knows who
// we are without us having to remember to do it every time.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default api;
