import express from "express";
import cors from "cors";
import { env } from "@trello-clone/env/server";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspace.js";
import boardRouter from "./routes/board.js";
import cardRouter from "./routes/card.js";
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
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRouter);
app.use("/api/boards", cardRouter);
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Trello Clone API",
  });
});
export default app;