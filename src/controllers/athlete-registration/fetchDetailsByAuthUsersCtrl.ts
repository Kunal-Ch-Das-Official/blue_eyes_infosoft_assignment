import { Request, Response } from "express";
import {
  notFoundRes,
  unauthorizedRes,
} from "../../utils/responses/clientError";
import { internalServerError } from "../../utils/responses/serverError";
import prisma from "../../../prisma";

const fetchDetailsByAuthUsersCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = req.currentUser;

  if (!user)
    return unauthorizedRes(res, "Please signup or login to access this route");

  try {
    const isAuthUser = await prisma.user_auth.findFirst({
      where: {
        OR: [{ id: user.id, role: "USER" }],
      },
    });

    if (!isAuthUser)
      return notFoundRes(
        res,
        "Something went wrong, user authenticity invalid.",
      );

    const fetchOwnSubmittedData = await prisma.player_details.findMany({
      where: {
        id: user.id,
      },
      include: {
        playerDocuments: true,
        competitionPlayed: true,
      },
    });

    return <any>res.status(200).json(fetchOwnSubmittedData);
  } catch (error: unknown) {
    return internalServerError(res, (error as Error).message);
  }
};

export default fetchDetailsByAuthUsersCtrl;
