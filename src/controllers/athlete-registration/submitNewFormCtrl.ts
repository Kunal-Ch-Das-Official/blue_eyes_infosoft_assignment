import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

import { TypeAthleteForm } from "../../types/TypeAthleteForm";
import {
  unauthorizedRes,
  unprocessableRes,
} from "../../utils/responses/clientError";
import prisma from "../../../prisma";
import { internalServerError } from "../../utils/responses/serverError";
import { createdRes } from "../../utils/responses/successRes";
import { Prisma } from "@prisma/client";
import multipleBlobDestroyer from "../../services/blob-upload/multipleBlobDestroyer";
import blobDestroyer from "../../services/blob-upload/blobDestroyer";
import { calculateAge, parseDate } from "../../utils/calculateAge";
import envConfig from "../../config/envConfig";
import redisClient from "../../redis/redisClient";

const submitNewFormCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = req.currentUser;

  // 2. Check if user is authenticated or not
  if (!user || !user.id) {
    return unauthorizedRes(res, "Please sign up or login before submitting.");
  }

  // 3. Declare dynamic tracking keys
  const verificationOtp: string = req.body?.verificationOtp || "";
  const attemptKey = `${envConfig.otp_security_key}:attempts:${user.id}`;
  const dataAccessKey = `${envConfig.otp_security_key}:${user.id}:${verificationOtp}`;
  const staticKey = `${envConfig.data_signature}:${user.id}`;

  // 4. Determine if we are utilizing the fallback verified cache signature or active OTP
  const isEmailAlreadyVerified = verificationOtp.trim() === "";

  let accessData: string | null = null;

  // 5. Declare global variables
  let uploadProfilePhoto: any;
  let uploadPlayersDocument: any[] = [];
  let reqBody: TypeAthleteForm;

  // 6. Global blob storage cleanup logic
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
      console.log("Blob cleanup failed:", cleanupError);
    }
  };

  try {
    if (isEmailAlreadyVerified) {
      // Fetch directly from the verified signature key cache if OTP parameter was bypassed by the client
      accessData = await redisClient.get(staticKey);

      if (!accessData) {
        await cleanupBlobs();
        return unauthorizedRes(
          res,
          "Verified session expired or invalid. Please refresh and try again.",
        );
      }
    } else {
      // Standard OTP verification cycle pipeline
      accessData = await redisClient.get(dataAccessKey);

      if (!accessData) {
        const attempts = await redisClient.incr(attemptKey);
        await redisClient.expire(attemptKey, 300);

        if (attempts >= 3) {
          await redisClient.del(dataAccessKey);
          await redisClient.del(attemptKey);
          await cleanupBlobs();

          return unauthorizedRes(
            res,
            "Maximum OTP attempts exceeded. Please request a new OTP.",
          );
        }

        return unauthorizedRes(
          res,
          `Invalid OTP. ${3 - attempts} attempts remaining.`,
        );
      }
    }

    // Parse the payload cached inside Redis
    const result: {
      reqBody: TypeAthleteForm;
      uploadPlayersDocument: any[];
      uploadProfilePhoto: any;
    } = JSON.parse(accessData);

    reqBody = result.reqBody;
    uploadPlayersDocument = result.uploadPlayersDocument ?? [];
    uploadProfilePhoto = result.uploadProfilePhoto;

    // Flush active verification tokens upon successful validation consumption
    if (!isEmailAlreadyVerified) {
      await redisClient.del(dataAccessKey);
      await redisClient.del(attemptKey);
    } else {
      await redisClient.del(staticKey); // Clear the static key signature signature once consumed safely
    }

    const dateOfBirth = parseDate(reqBody.dateOfBirth);
    const currentAge = calculateAge(reqBody.dateOfBirth);
    const playerId = uuid();

    const photoUrl = uploadProfilePhoto?.documentUrl || "";
    const photoAccessId = uploadProfilePhoto?.documentAccessUrl || "";
    const validDocuments = (uploadPlayersDocument ?? []).filter(Boolean);

    const transactionOps: Prisma.PrismaPromise<any>[] = [
      prisma.player_details.create({
        data: {
          id: playerId,
          userId: user.id,
          playerName: reqBody.playerName,
          fathersName: reqBody.fathersName,
          mothersName: reqBody.mothersName,
          dateOfBirth: dateOfBirth,
          currentAge: String(currentAge),
          gender: reqBody.gender,
          playersPhotoUrl: photoUrl,
          playersPhotoPId: photoAccessId,
          emailAddress: reqBody.emailAddress,
          contactNumber: reqBody.contactNumber,
          alternateMobileNo: reqBody.alternateMobileNo,
          address: reqBody.address,
          pinCode: reqBody.pinCode,
          stateOrProvince: reqBody.stateOrProvince,
          country: reqBody.country,
          club: reqBody.club,
          sports: reqBody.sports,
        },
      }),
    ];

    if (validDocuments.length > 0) {
      transactionOps.push(
        prisma.players_document.createMany({
          data: validDocuments.map((doc) => ({
            documentName: doc.documentName,
            documentType: doc.documentType,
            documentUrl: doc.documentUrl,
            documentAccessUrl: doc.documentAccessUrl,
            documentSize: doc.documentSize,
            playerId: playerId,
          })),
        }),
      );
    }

    if ((reqBody.competitions ?? []).length > 0) {
      transactionOps.push(
        prisma.competition_played.createMany({
          data: (reqBody.competitions ?? []).map((comp) => ({
            competitionName: comp.competitionName,
            sports: comp.sports,
            category: comp.category,
            position: comp.position,
            playerId: playerId,
          })),
        }),
      );
    }

    await prisma.$transaction(transactionOps);
    return createdRes(res, "Details have been successfully submitted.");
  } catch (error: unknown) {
    console.log(error);
    await cleanupBlobs();

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return unprocessableRes(
            res,
            "Email or mobile number already exists.",
          );
        case "P2003":
          return unprocessableRes(res, "Foreign key constraint failed.");
      }
    }
    return internalServerError(res, "Something went wrong.");
  }
};

export default submitNewFormCtrl;
