// This file sets up our frontend tool (Vite). The "proxy" part means:
// whenever our React app asks for something starting with /api, secretly
// send that request to our backend server running on port 5000.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
