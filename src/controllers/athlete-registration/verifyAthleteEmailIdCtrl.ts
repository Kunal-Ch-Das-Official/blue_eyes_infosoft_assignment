import { Request, Response } from "express";
import crypto from "crypto";
import {
  unauthorizedRes,
  unprocessableRes,
} from "../../utils/responses/clientError";
import {
  internalServerError
} from "../../utils/responses/serverError";
import { z } from "zod";
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


  let writtenRedisKey: string | null = null;

  let uploadPlayersDocument: any[] = [];
  let uploadProfilePhoto: any;

  if (!user)
    return unauthorizedRes(res, "Please sign in or sign up to proceed.");


  // Reusable clean up function 
  const cleanupBlobs = async () => {
    try {
      const docs = (uploadPlayersDocument ?? [])
        .filter(Boolean)
        .map((item) => item?.documentAccessUrl)
        .filter(Boolean);

      if (docs.length > 0) {
        await multipleBlobDestroyer(docs);
      }

      if (uploadProfilePhoto?.documentAccessUrl) {
        await blobDestroyer(uploadProfilePhoto.documentAccessUrl);
      }
    } catch (cleanupError) {
      console.error("Blob cleanup failed:", cleanupError);
    }
  };

  try {
    if (user.role === "ADMIN")
      return unprocessableRes(res, "Admin are not allowed.");

// Store files 
    const files = (req.files ?? {}) as {
      profile_photo?: Express.Multer.File[];
      players_document?: Express.Multer.File[];
    };

    // array and object parsed 
    let parsedFileTitles: unknown;
    let parsedCompetitions: unknown;
    try {
      parsedFileTitles =
        typeof req.body.fileTitles === "string"
          ? JSON.parse(req.body.fileTitles)
          : (req.body.fileTitles ?? []);

      parsedCompetitions =
        typeof req.body.competitions === "string"
          ? JSON.parse(req.body.competitions)
          : (req.body.competitions ?? []);
    } catch {
      return unprocessableRes(
        res,
        "fileTitles or competitions is not valid JSON.",
      );
    }

    // Parse multipart/form-data JSON fields
    const body: TypeAthleteForm = {
      ...req.body,
      fileTitles: parsedFileTitles,
      competitions: parsedCompetitions,
    } as TypeAthleteForm;

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

    
    // Check all document is been uploaded or not
    const settledUploads = await Promise.allSettled(
      playersDocument.map((file, index) =>
        uploadBlobData(file, "athletes/documents", titles[index]),
      ),
    );
    uploadPlayersDocument = settledUploads.map((settled) =>
      settled.status === "fulfilled" ? settled.value : null,
    );

    
    // If any file failed then remove all uploaded docs 
    if (uploadPlayersDocument.some((file) => file === null)) {
      await cleanupBlobs();
      return unprocessableRes(res, "One or more files failed to upload.");
    }

    // Put all data in a container 
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
      // No OTP needed — the submitted email is the user's own verified
      // account email. Store the pending submission directly.
      const dataKey = `${envConfig.data_signature}:${user.id}`;
      const saveDataToRedis = await redisClient.setex(
        dataKey,
        5 * 60, // 5 minutes
        JSON.stringify(stringifyObj),
      );

      // If not stored then cleanup upload docs 
      if (saveDataToRedis !== "OK") {
        await cleanupBlobs();
        return internalServerError(
          res,
          "Data was not saved. Please try again.",
        );
      }

      writtenRedisKey = dataKey;
      return successRes(res, "Email already verified.");
    } else {
     
      // OTP creating process 
      const otp = crypto.randomInt(100000, 1_000_000);
      const otpKey = `${envConfig.otp_security_key}:${user.id}:${otp}`;

      const saveOtpToRedis = await redisClient.setex(
        otpKey,
        5 * 60, // 5 minutes
        JSON.stringify(stringifyObj),
      );

      if (saveOtpToRedis !== "OK") {
        await cleanupBlobs();
        return internalServerError(
          res,
          "OTP was not saved. Please try again.",
        );
      }

      writtenRedisKey = otpKey;

      // Send OTP to the email 
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
        await cleanupBlobs();
        await redisClient.del(otpKey);
        writtenRedisKey = null;
        console.error("Error sending verification email:", mailError);
        return internalServerError(
          res,
          "Failed to send verification email. Please try again later.",
        );
      }

      return successRes(
        res,
        "Verification code sent successfully to your email.",
      );
    }
  } catch (error: unknown) {
    await cleanupBlobs();

    // delete the key we know we wrote during 500 err.
    if (writtenRedisKey) {
      await redisClient.del(writtenRedisKey);
    }

    return internalServerError(res, (error as Error).message);
  }
};

export default verifyAthleteEmailIdCtrl;