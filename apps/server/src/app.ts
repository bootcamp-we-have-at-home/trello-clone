import express from "express";
import cors from "cors";
import { env } from "@trello-clone/env/server";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
const app: express.Application = express();
app.set("trust proxy", false);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Trello Clone API",
  });
});
export default app;