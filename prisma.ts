import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import envConfig from "./src/config/envConfig";


const DATABASE_URL = envConfig.database_url;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: ["warn", "error"],
});

export default prisma;