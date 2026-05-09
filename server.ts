import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware para JSON
  app.use(express.json());

  // API: Registro de analíticas de WhatsApp (Ejemplo de backend)
  app.post("/api/analytics/click", (req, res) => {
    const { productId, timestamp } = req.body;
    console.log(
      `[Analytics] Click en WhatsApp para producto ${productId} a las ${timestamp}`,
    );
    res.json({ status: "success", message: "Click registrado" });
  });

  // Integración con Vite (Frontend)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Punto Verde Server: http://localhost:${PORT}`);
  });
}

startServer();
