import express from "express";
import cors from "cors";
import { env } from "@trello-clone/env/server";
import authRoutes from "./routes/auth.js";
const app: express.Application = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Trello Clone API",
  });
});
app.use("/api/auth", authRoutes);
export default app;