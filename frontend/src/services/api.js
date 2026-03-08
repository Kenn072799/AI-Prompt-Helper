import axios from "axios";

// In production (Vercel), VITE_API_URL points to the Render backend.
// In development, Vite's proxy forwards /api to localhost.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "/api",
  headers: { "Content-Type": "application/json" },
});

export const promptApi = {
  analyze: (originalPrompt) =>
    api.post("/prompts/analyze", { originalPrompt }).then((r) => r.data),

  getHistory: () => api.get("/prompts/history").then((r) => r.data),

  getById: (id) => api.get(`/prompts/${id}`).then((r) => r.data),

  getTrends: (force = false) =>
    api.get(`/prompts/trends${force ? "?force=true" : ""}`).then((r) => r.data),
};
