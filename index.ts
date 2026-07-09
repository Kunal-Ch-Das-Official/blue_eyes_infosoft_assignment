//? Project: Blue Eyes Infosoft Assignment.
//* Author: Kunal Chandra Das.
//! Contact info: kunalchandradasofficial@gmail.com
//& Date: 09-07-2026

import prisma from "./prisma";
import envConfig from "./src/config/envConfig";

import { httpServer } from "./src/server";
const port = envConfig.port || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL successfully");

    httpServer.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
}

startServer();
