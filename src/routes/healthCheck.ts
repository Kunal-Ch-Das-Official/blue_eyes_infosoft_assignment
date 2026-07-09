// src/routes/health.ts
import { Router } from "express";
import prisma from '../../prisma'
const healthCheck = Router();

healthCheck.get("/health", async (_req, res) => {
  try {
    // Check Postgres (simple query or SELECT 1)
    await prisma.$queryRaw`SELECT 1`;



    res.status(200).json({
      status: "ok",
      services: {
        database: "up",
      },
    });
  } catch (err) {
    res.status(503).json({
      status: "error",
      error: (err as Error).message,
    });
  }
});

export default healthCheck;