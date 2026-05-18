import express from "express";
import analyticsRoutes from "./infrastructure/http/routes/analytics.routes.js";

const app = express();

// Middleware para JSON
app.use(express.json());

// Usar el router principal
app.use("/api/analytics", analyticsRoutes);

export default app;
