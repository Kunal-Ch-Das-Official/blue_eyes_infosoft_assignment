import nodemailer from "nodemailer";
import envConfig from "../../config/envConfig";

interface OTPMailOptions {
  to: string;
  subject: string;
  html: any;
}

const sendVerificationOTP = async (options: OTPMailOptions) => {
  const transporter = nodemailer.createTransport({
    host: envConfig.smtp_protocol,
    port: Number(envConfig.smtp_port || 465),
    secure: true, // true for 465, false for other ports
    auth: {
      user: envConfig.smtp_sender, // <-- your email address
      pass: envConfig.smtp_password, // <-- the app password
    },
  });

  // Example send
  await transporter.sendMail({
    from: `"Sports Club" <${envConfig.smtp_sender}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

export default sendVerificationOTP;
