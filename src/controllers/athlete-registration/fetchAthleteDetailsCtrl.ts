import { Request, Response } from "express";
import prisma from "../../../prisma";
import {
  notFoundRes,
  unauthorizedRes,
} from "../../utils/responses/clientError";
import { internalServerError } from "../../utils/responses/serverError";

const fetchAthleteDetailsCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = req.currentUser;
  const { id }: { id?: string } = req.params;

  if (user.role !== "ADMIN")
    return unauthorizedRes(res, "Only admin can access this route.");

  try {
    if (id) {
      const fetchTotalData = await prisma.player_details.findUnique({
        where: {
          id: id,
        },
        include: {
          playerDocuments: true,
          competitionPlayed: true,
        },
      });

      if (!fetchTotalData) {
        return notFoundRes(res, "Requested data not exist.");
      } else {
        return <any>res.status(200).json(fetchTotalData);
      }
    } else {
      const fetchAllDetails = await prisma.player_details.findMany({
        select: {
          id: true,
          playerName: true,
          contactNumber: true,
          currentAge: true,
          formStatus: true,
          competitionPlayed: true,
          createdAt: true,
        },
      });

      return <any>res.status(200).json(fetchAllDetails);
    }
  } catch (error: unknown) {
    return internalServerError(res, (error as Error).message);
  }
};

export default fetchAthleteDetailsCtrl;
