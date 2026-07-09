import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import {
  badRequestRes,
  unauthorizedRes,
} from "../../../utils/responses/clientError";
import {
  internalServerError,
  notImplementedError,
} from "../../../utils/responses/serverError";
import envConfig from "../../../config/envConfig";
import redisClient from "../../../redis/redisClient";
import prisma from "../../../../prisma";
import successEmail from "../../../mail-engines/successEmail";
import { successRes } from "../../../utils/responses/successRes";

const registrationVerificationCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { oneTimePassword }: { oneTimePassword: string } = req.body;

  if (!oneTimePassword) return badRequestRes(res, "OTP is require to proceed.");

  try {
    const dataAccessKey = `${envConfig.otp_security_key}:${oneTimePassword}`;
    const accessUserData = await redisClient.get(dataAccessKey);

    if (!accessUserData)
      return unauthorizedRes(res, "Provided OTP is invalid.");

    const decryptData: {
      fullName: string;
      emailId: string;
      password: string;
      role: "ADMIN" | "USER";
    } = JSON.parse(accessUserData);

    const registerNewUser = await prisma.user_auth.create({
      data: {
        id: uuid(),
        fullName: decryptData.fullName,
        emailId: decryptData.emailId,
        password: decryptData.password,
        role: decryptData.role,
      },
    });

    if (!registerNewUser) {
      notImplementedError(
        res,
        "Registration failed, please try again or contact to support.",
      );
    } else {
      await redisClient.del(dataAccessKey);

      //   Send Welcome message to user
      successEmail({
        to: decryptData.emailId,
        subject: "Welcome to Sports Club",
        html: `<p>Dear ${decryptData.fullName},</p>
                 <p>Welcome to Sports Club! We are thrilled to have you on board.</p>
                 <p>Your account has been successfully created.</p>
                 <p>We look forward to serving you and providing the best experience possible.</p>
                 <p>Please login and get started.</p>
                 <p>Please keep login credentials safe.</p>
                 <p>Best regards,<br/>Sports Club Team</p>`,
      });

      return successRes(
        res,
        "User registration successful. Please login and get started.",
      );
    }

    // Remove OTP from redis
  } catch (error: unknown) {
    return internalServerError(res, (error as Error).message);
  }
};

export default registrationVerificationCtrl;
