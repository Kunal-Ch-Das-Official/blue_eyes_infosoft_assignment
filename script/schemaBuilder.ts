import fs from "fs";
import path from "path";

const moduleDir = path.join(__dirname, "../src/models");
const outputFile = path.join(__dirname, "../prisma/schema.prisma");

const allModels = new Set<string>();
let combinedModules = "";

// Read all module files
const files = fs.readdirSync(moduleDir).filter((f) => f.endsWith(".prisma"));

for (const file of files) {
  const content = fs.readFileSync(path.join(moduleDir, file), "utf-8");

  // Split content into models
  const models = content
    .split(/model\s+/)
    .filter(Boolean)
    .map((s) => "model " + s);

  const filteredModels: string[] = [];

  for (const model of models) {
    const match = model.match(/model (\w+) {/);
    if (match) {
      const modelName = match[1];
      if (allModels.has(modelName)) {
        console.warn(`⚠️ Duplicate model skipped: ${modelName}`);
      } else {
        allModels.add(modelName);
        filteredModels.push(model);
      }
    }
  }

  if (filteredModels.length > 0) {
    combinedModules += filteredModels.join("\n\n") + "\n\n";
  }
}

// Header
const header = `
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
  binaryTargets   = ["native", "linux-musl-openssl-3.0.x"]
  previewFeatures = []
}
`;


// Write final schema.prisma
fs.writeFileSync(outputFile, header + "\n\n" + combinedModules.trim());
console.log("✅ Prisma schema built successfully!");