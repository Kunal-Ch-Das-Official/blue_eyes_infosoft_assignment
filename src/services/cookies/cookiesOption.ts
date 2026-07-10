import envConfig from "../../config/envConfig";
import { TypeCookies } from "../../types/TypeCookies";

const isProduction = envConfig.nodeEnv === "production";

// 1. Cookie Options #remember 30 days
// export const cookieOption: TypeCookies = {
//   httpOnly: true,
//   secure: isProduction,
//   sameSite: "lax",
//   maxAge: 3 * 24 * 60 * 60 * 1000, // 7 days
//   priority: "high", // High priority for client cookies
//   domain: isProduction ? ".example.com" : undefined,
//   path: "/",
// };

export const cookieOption: TypeCookies = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  path: "/",
};