import jwt from "jsonwebtoken";
import { Response } from "express";
import envConfig from "../config/envConfig";
import { unauthorizedRes } from "./responses/clientError";
import { cookieOption } from "../services/cookies/cookiesOption";
import successEmail from "../services/emails/successEmail";
import { successRes } from "./responses/successRes";
import { notImplementedError } from "./responses/serverError";
import { TypeApiResponse } from "../types/TypeApiResponse";
import { TypeUserData } from "../types/TypeUserData";

// / Function to generate JWT token and send response with authentication details
const tokenGenerator = async (
  cookieName: string,
  user: TypeUserData,
  res: Response<TypeApiResponse>,
) => {
  const token = jwt.sign(
    { userId: user.id, userRole: user.role },
    envConfig.jwt_secret,
    {
      algorithm: "HS256",
      expiresIn: "3d",
    },
  );
  // During token verification
  let payload: string | jwt.JwtPayload;
  try {
    payload = jwt.verify(token, envConfig.jwt_secret);
  } catch (err) {
    return unauthorizedRes(res, (err as Error).message);
  }

  if (token) {
    res.cookie(cookieName, token, cookieOption); // Set the JWT token in cookies
    const { fullName, emailId } = user; // Extract username and email from user object

    // Send an email alert notifying the user of successful login
    //   Send Welcome message to user
    await successEmail({
      to: emailId,
      subject: "You've Successfully Logged In to Sports Club.",
      html:
        `<p>Dear ${fullName},</p><p>Welcome to Sports Club! We're glad to have you on board.</p>` +
        `<p>This is a confirmation that you have successfully logged into your account associated with this email address.</p>` +
        `<p>If you did not initiate this login, please reset your password immediately or contact our support team.</p>` +
        `<p>Best regards,<br/>Sports Club</p>`,
    }).catch((err) => {
      console.error("Failed to send login alert:", err.message); // Log error if email sending fails
    });

    return successRes(res, "Login successful, welcome aboard!"); // Return success response
  } else {
    return notImplementedError(res, "Unable to generate token"); // Return not implemented response if token generation fails
  }
};

export default tokenGenerator;
