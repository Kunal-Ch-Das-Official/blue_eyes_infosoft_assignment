import { Request, Response } from "express";
import { z } from "zod";
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

const submitNewFormCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = req.currentUser;

  let uploadProfilePhoto: any;
  let uploadPlayersDocument = [];
  let reqBody: TypeAthleteForm;

  const { verificationOtp }: { verificationOtp?: string } = req.body;

  if (!user.id)
    return unauthorizedRes(res, "Please sign up or login before submit.");

  try {
    const dataAccessKey = verificationOtp
      ? `${envConfig.otp_security_key}:${user.id}:${verificationOtp}`
      : `${envConfig.data_signature}:${user.id}`;

    const accessData = await redisClient.get(dataAccessKey);

    if (!accessData) {
      return unauthorizedRes(res, "Invalid OTP, Please try again later.");
    } else {
      const result: {
        reqBody: TypeAthleteForm;
        uploadPlayersDocument: any;
        uploadProfilePhoto: any;
      } = JSON.parse(accessData);

      reqBody = result.reqBody;
      uploadPlayersDocument = result.uploadPlayersDocument;
      uploadProfilePhoto = result.uploadProfilePhoto;
    }
    await redisClient.del(dataAccessKey);
    const dateOfBirth = parseDate(reqBody.dateOfBirth);
    const currentAge = calculateAge(reqBody.dateOfBirth);
    const playerId = uuid();

    // prisma operations
    await prisma.$transaction([
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
          playersPhotoUrl: uploadProfilePhoto.documentUrl || "",
          playersPhotoPId: uploadProfilePhoto.documentAccessUrl || "",
          emailAddress: reqBody.emailAddress,
          contactNumber: reqBody.contactNumber,
          alternateMobileNo: reqBody.alternateMobileNo,
          nationality: reqBody.nationality,
          bloodGroup: reqBody.bloodGroup,
          height: reqBody.height,
          weight: reqBody.weight,
          governmentIdProof: reqBody.governmentIdProofNo,
          address: reqBody.address,
          pinCode: reqBody.pinCode,
          stateOrProvince: reqBody.stateOrProvince,
          country: reqBody.country,
          club: reqBody.club,
          sports: reqBody.sports,
        },
      }),

      prisma.players_document.createMany({
        data: uploadPlayersDocument.map((doc) => ({
          documentName: doc.documentName,
          documentType: doc.documentType,
          documentUrl: doc.documentUrl,
          documentAccessUrl: doc.documentAccessUrl,
          documentSize: doc.documentSize,
          playerId: playerId,
        })),
      }),

      prisma.competition_played.createMany({
        data: (reqBody.competitions ?? []).map((comp) => ({
          competitionName: comp.competitionName,
          sports: comp.sports,
          category: comp.category,
          position: comp.position,
          playerId: playerId,
        })),
      }),
    ]);

    return createdRes(res, "Details have been successfully submitted.");
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.code);
      console.log(error.meta);

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

    return internalServerError(res, "Something went wrong.");
  }
};

export default submitNewFormCtrl;
