import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
  // baseURL: "https://4c71c05ac111.ngrok-free.app",
  // baseURL: "https://horse-brand.vercel.app",
});
