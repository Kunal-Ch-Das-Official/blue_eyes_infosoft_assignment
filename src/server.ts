// src/server.ts
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import { createServer } from "http";
import cors from "cors";
import healthCheck from "./routes/healthCheck";
import authenticationRouter from "./routes/authenticationRouter";
import athleteRegistrationRouter from "./routes/athleteRegistrationRouter";

const app: express.Application = express();
const httpServer = createServer(app);

// ---------------- MIDDLEWARE ----------------
app.use(
  cors({
    origin: ["http://localhost:4173", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Added OPTIONS
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Pragma",
      "Expires",
    ],
  }),
);

app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

app.use(healthCheck);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Welcome to sports club management system");
});




// --------------- Router Registration -------------------

app.use("/api/v1/sports-club-crm/auth", authenticationRouter)
app.use("/api/v1/sports-club-crm/athlete-ops", athleteRegistrationRouter)








// ---------------- ERROR HANDLER ----------------
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(500).send(err.message);
  } else if (err) {
    res.status(400).send((err as Error).message);
  } else {
    next();
  }
});

export { httpServer };
