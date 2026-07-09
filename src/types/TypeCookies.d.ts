
export interface TypeCookies {
  httpOnly: boolean; // Prevent JavaScript access to the cookie
  secure: boolean; // Use HTTPS in production
  sameSite: "strict" | "lax" | "none"; // Control cross-site behavior
  maxAge: number; // Expiration time in milliseconds
  priority?: "high" | "low" | "medium"; // Priority of the cookie
  domain?: string;
  path?: string;
}
