// src/server.ts
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import { createServer } from "http";
import cors from "cors";
import healthCheck from "./routes/healthCheck";
import authenticationRouter from "./routes/authenticationRouter";
import athleteRegistrationRouter from "./routes/athleteRegistrationRouter";
// import helmet from "helmet";

const app: express.Application = express();
const httpServer = createServer(app);

// ---------------- MIDDLEWARE ----------------
app.use(
  cors({
    origin: [
      "http://localhost:4173",
      "http://localhost:4174",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Pragma",
      "Expires",
    ],
  }),
);


// Helmet middleware for production grade security (No need in development environment)
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "'strict-dynamic'", "https://trusted-cdn.com"],
//         styleSrc: ["'self'", "https://fonts.googleapis.com"],
//         imgSrc: ["'self'", "data:", "https://*"],
//         connectSrc: [
//           "'self'",
//               "http://localhost:4173",
//       "http://localhost:4174",
//       "http://localhost:5173",
//       "http://localhost:5174",
//       "http://localhost:3000",
//         ],
//         fontSrc: ["'self'", "https://fonts.gstatic.com"],
//         objectSrc: ["'none'"],
//         frameSrc: ["'self'"],
//         upgradeInsecureRequests: [],
//       },
//     },
//     frameguard: { action: "sameorigin" },
//     referrerPolicy: { policy: "strict-origin-when-cross-origin" },
//     hsts: {
//       maxAge: 31536000,
//       includeSubDomains: true,
//       preload: true,
//     },
//     dnsPrefetchControl: { allow: false },
//     hidePoweredBy: true,
//     xssFilter: true,
//     noSniff: true,
//     ieNoOpen: true,
//     crossOriginEmbedderPolicy: true,
//     crossOriginOpenerPolicy: { policy: "same-origin" },
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//   }),
// );

app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

app.use(healthCheck);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Welcome to sports club management system");
});

// --------------- Router Registration -------------------

app.use("/api/v1/sports-club-crm/auth", authenticationRouter);
app.use("/api/v1/sports-club-crm/athlete-ops", athleteRegistrationRouter);

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
