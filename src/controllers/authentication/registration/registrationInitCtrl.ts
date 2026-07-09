import { Request, Response } from "express";
import crypto from "crypto";
import {
  badRequestRes,
  conflictRes,
} from "../../../utils/responses/clientError";
import prisma from "../../../../prisma";
import passwordSalting from "../../../utils/passwordSalting";
import redisClient from "../../../redis/redisClient";
import envConfig from "../../../config/envConfig";
import {
  internalServerError,
  notImplementedError,
} from "../../../utils/responses/serverError";
import { successRes } from "../../../utils/responses/successRes";
import sendVerificationOTP from "../../../services/emails/sendVerificationOTP";

const registrationInitCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {role}:{role?: "ADMIN" | "USER"} = req.query;
  const {
    fullName,
    emailId,
    password,
    confirmPassword,
  }: {
    fullName: string;
    emailId: string;
    password: string;
    confirmPassword: string;
  } = req.body;

  if (!fullName && !emailId && !password && !role) {
    return badRequestRes(res, "All fields are require to proceed.");
  }
  if (password !== confirmPassword)
    return badRequestRes(res, "Password and confirm password does not match.");

  try {
    const isUserExist = await prisma.user_auth.findFirst({
      where: {
        emailId: emailId,
      },
    });

    if (isUserExist)
      return conflictRes(
        res,
        "Requested user already exist with the same mail id.",
      );

    const otp = crypto.randomInt(100000, 999999);
    const hashedPassword = await passwordSalting(password);
    const userDetails: {
      fullName: string;
      emailId: string;
      password: string;
      role?: "ADMIN" | "USER";
    } = {
      fullName,
      emailId,
      password: hashedPassword,
      role: role ?? "USER",
    };


    // Save to redis
    const saveOtpToRedis = await redisClient.setex(
      `${envConfig.otp_security_key}:${otp}`,
      5 * 60, // 5 minutes
      JSON.stringify(userDetails),
    );

    if (saveOtpToRedis !== "OK")
      return notImplementedError(res, "OTP was not saved. Please try again.");

    // ✅ Send OTP Email (wrapped in try-catch to handle async send errors gracefully)
    try {
      await sendVerificationOTP({
        to: emailId,
        subject: "Your Verification Code",
        html: `
          <p>Hello ${fullName},</p>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
        `,
      });
    } catch (mailError) {
      console.error("Error sending verification email:", mailError);
      return internalServerError(
        res,
        "Failed to send verification email. Please try again later.",
      );
    }

    // ✅ Success response
    return successRes(
      res,
      "Verification code sent successfully to your email.",
    );
  } catch (error: unknown) {
    return internalServerError(res, (error as Error).message);
  }
};

export default registrationInitCtrl;
