import "dotenv/config";
import { defineConfig } from "prisma/config";
import envConfig from "./src/config/envConfig";

const DATABASE_URL = envConfig.database_url;

const config = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: DATABASE_URL ?? "" },
});

module.exports = config;
