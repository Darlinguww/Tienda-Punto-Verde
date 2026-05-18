import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware para JSON
  app.use(express.json());

  // Importar la API (Serverless en producción, middleware en local)
  const { default: apiApp } = await import("./api/index.ts");
  app.use(apiApp);

  // Integración con Vite (Frontend)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      app.use((req, res, next) => {
        if (req.path.endsWith(".js") || req.path.endsWith(".mjs")) {
          res.setHeader("Content-Type", "application/javascript");
        } else if (req.path.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
        }
        next();
      });
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(indexPath);
      });
    } else {
      const mimeTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".tsx": "text/tsx",
        ".ts": "text/typescript",
        ".jsx": "text/jsx",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
      };
      const root = process.cwd();
      app.use((req, res, next) => {
        let filePath = path.join(root, req.path);
        if (!fs.existsSync(filePath)) {
          filePath = path.join(root, "index.html");
        }
        const ext = path.extname(filePath);
        const contentType = mimeTypes[ext] || "application/octet-stream";
        res.setHeader("Content-Type", contentType);
        res.sendFile(filePath);
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Punto Verde Server: http://localhost:${PORT}`);
  });
}

startServer();
