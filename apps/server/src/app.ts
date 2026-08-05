import express from "express";
import cors from "cors";

const app: express.Application = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
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

export default app;