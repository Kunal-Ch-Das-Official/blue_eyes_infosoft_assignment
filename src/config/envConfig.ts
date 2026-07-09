import "dotenv/config";

const environment = {
  port: process.env.PORT || 3000,

  cloudinary_name: process.env.CLOUDINARY_NAME || "",
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY || "",
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET || "",
  database_url: process.env.DIRECT_URL || "",
  redis_url: process.env.REDIS_URL || "",
  otp_security_key: process.env.OTP_SECURITY_KEY || "",
  smtp_protocol: process.env.SMTP_PROTOCOL || "",
  smtp_port: process.env.SMTP_PORT || 500,
  smtp_sender: process.env.SMTP_SENDER || "",
  smtp_password: process.env.SMTP_PASS || "",
};

const envConfig = Object.freeze(environment);
export default envConfig;
