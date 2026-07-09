import Redis from "ioredis";
import envConfig from "../config/envConfig";

const REDIS_URL = envConfig.redis_url || "redis://localhost:6379";

const redisClient = new Redis(REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 100, 2000),
  maxRetriesPerRequest: null,
});

// Event Listeners
redisClient.on("connect", () => {
  console.log("[redis] Connected");
});

redisClient.on("ready", () => {
  console.log("[redis] Ready");
});

redisClient.on("error", (err) => {
  console.error("[redis] Error:", err.message);
});

redisClient.on("close", () => {
  console.log("[redis] Connection closed");
});

redisClient.on("reconnecting", () => {
  console.log("[redis] Reconnecting...");
});

export async function disconnectRedis() {
  try {
    await redisClient.quit();
  } catch {
    redisClient.disconnect();
  }
}

export default redisClient;