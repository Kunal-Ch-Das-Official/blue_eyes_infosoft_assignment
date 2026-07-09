import { Request, Response } from "express";
import crypto from "crypto";
import {
  unauthorizedRes,
  unprocessableRes,
} from "../../utils/responses/clientError";
import {
  internalServerError,
  notImplementedError,
} from "../../utils/responses/serverError";
import { success, z } from "zod";
import { TypeAthleteForm } from "../../types/TypeAthleteForm";
import envConfig from "../../config/envConfig";
import redisClient from "../../redis/redisClient";
import { successRes } from "../../utils/responses/successRes";
import sendVerificationOTP from "../../services/emails/sendVerificationOTP";
import uploadBlobData from "../../services/blob-upload/uploadBlobData";
import multipleBlobDestroyer from "../../services/blob-upload/multipleBlobDestroyer";
import blobDestroyer from "../../services/blob-upload/blobDestroyer";

export const athleteSchema = z.object({
  playerName: z.string().min(1),
  fathersName: z.string().min(1),
  mothersName: z.string().min(1),
  dateOfBirth: z.string(),
  gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
  emailAddress: z.string().email(),
  contactNumber: z
    .string()
    .trim()
    .regex(/^(?:\+91|91)?[6-9]\d{9}$/, {
      message: "Invalid mobile number",
    }),
  alternateMobileNo: z
    .string()
    .trim()
    .regex(/^(?:\+91|91)?[6-9]\d{9}$/, {
      message: "Invalid mobile number",
    }),
  nationality: z.string(),
  bloodGroup: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "A_B_POSITIVE",
    "A_B_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
    "NOT_KNOWN",
  ]),
  height: z.string().optional(),
  weight: z.string().optional(),
  governmentIdProofNo: z.string().optional(),
  address: z.string(),
  pinCode: z.string(),
  stateOrProvince: z.string(),
  country: z.string(),
  club: z.string(),
  sports: z.string(),
  fileTitles: z.array(z.string()).optional(),
  competitions: z
    .array(
      z.object({
        competitionName: z.string(),
        sports: z.string(),
        category: z.string().optional(),
        position: z.string().optional(),
      }),
    )
    .optional(),
});

const verifyAthleteEmailIdCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = req.currentUser;
  let otp: number;

  let uploadPlayersDocument = [];
  let uploadProfilePhoto: any;

  if (!user)
    return unauthorizedRes(res, "Please sign in or sign up to proceed.");

  try {
    if (user.role === "ADMIN")
      return unprocessableRes(res, "Admin are not allowed.");

    // Parse multipart/form-data JSON fields
    const body: TypeAthleteForm = {
      ...req.body,

      fileTitles:
        typeof req.body.fileTitles === "string"
          ? JSON.parse(req.body.fileTitles)
          : (req.body.fileTitles ?? []),

      competitions:
        typeof req.body.competitions === "string"
          ? JSON.parse(req.body.competitions)
          : (req.body.competitions ?? []),
    };

    // Validate body
    const result = athleteSchema.safeParse(body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        errors: result.error.flatten(),
      });
      return;
    }

    const reqBody = result.data;

    const files = req.files as {
      profile_photo?: Express.Multer.File[];
      players_document?: Express.Multer.File[];
    };

    const profilePhoto = files.profile_photo?.[0];
    if (!profilePhoto) {
      return unprocessableRes(res, "Profile photo is required to proceed.");
    }

    const playersDocument = files.players_document ?? [];

    const titles = reqBody.fileTitles ?? [];

    if (playersDocument.length !== titles.length) {
      return unprocessableRes(
        res,
        "File count and title count does not match.",
      );
    }

    // Upload profilePhoto
    uploadProfilePhoto = await uploadBlobData(
      profilePhoto,
      "/athletes/profile-pic",
    );

    if (!uploadProfilePhoto)
      return unprocessableRes(res, "Profile photo upload failed.");

    // Upload all files in parallel
    uploadPlayersDocument = await Promise.all(
      playersDocument.map((file, index) =>
        uploadBlobData(file, "athletes/documents", titles[index]),
      ),
    );

    // Check upload failure
    if (uploadPlayersDocument.some((file) => file === null)) {
      uploadPlayersDocument.length > 0 &&
        (await multipleBlobDestroyer(
          uploadPlayersDocument.map((item) => item.documentAccessUrl),
        ));

      return unprocessableRes(res, "One or more files failed to upload.");
    }

    const stringifyObj = {
      reqBody: reqBody as TypeAthleteForm,
      uploadPlayersDocument: uploadPlayersDocument,
      uploadProfilePhoto: uploadProfilePhoto,
    };

    // Is email match
    const emailMatches =
      user.emailId.trim().toLowerCase() ===
      reqBody.emailAddress.trim().toLowerCase();

    if (emailMatches) {
      // store to redis
      const saveDataToRedis = await redisClient.setex(
        `${envConfig.data_signature}:${user.id}`,
        5 * 60, // 5 minutes
        JSON.stringify(stringifyObj),
      );

      if (saveDataToRedis !== "OK") {
        return notImplementedError(
          res,
          "Data was not saved. Please try again.",
        );
      } else {
        return successRes(res, "Email already verified.");
      }
    } else {
      otp = crypto.randomInt(100000, 999999);
      // Save to redis
      const saveOtpToRedis = await redisClient.setex(
        `${envConfig.otp_security_key}:${user.id}:${otp}`,
        5 * 60, // 5 minutes
        JSON.stringify(stringifyObj),
      );

      if (saveOtpToRedis !== "OK") {
        return notImplementedError(res, "OTP was not saved. Please try again.");
      } else {
        // ✅ Send OTP Email (wrapped in try-catch to handle async send errors gracefully)
        try {
          await sendVerificationOTP({
            to: reqBody.emailAddress,
            subject: "Your Email Verification Code",
            html: `
          <p>Hello ${reqBody.playerName},</p>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
        `,
          });
        } catch (mailError) {
          //! Cleanup functions
          if (uploadPlayersDocument.length > 0) {
            await multipleBlobDestroyer(
              uploadPlayersDocument
                .filter(Boolean)
                .map((item) => item.documentAccessUrl),
            );
          }

          if (uploadProfilePhoto?.documentAccessUrl) {
            await blobDestroyer(uploadProfilePhoto.documentAccessUrl);
          }
          // Delete if failed
          await redisClient.del(
            `${envConfig.otp_security_key}:${user.id}:${otp}`,
          );
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
      }
    }
  } catch (error: unknown) {
    //! Cleanup functions
    if (uploadPlayersDocument.length > 0) {
      await multipleBlobDestroyer(
        uploadPlayersDocument
          .filter(Boolean)
          .map((item) => item.documentAccessUrl),
      );
    }

    if (uploadProfilePhoto?.documentAccessUrl) {
      await blobDestroyer(uploadProfilePhoto.documentAccessUrl);
    }
    await redisClient.del(`${envConfig.otp_security_key}:${user.id}:${otp}`);
    return internalServerError(res, (error as Error).message);
  }
};

export default verifyAthleteEmailIdCtrl;
