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

  if (!user || !user.id) {
    return unauthorizedRes(res, "Please signup or login to access this route");
  }

  try {
    // 1. Verify user exists and has the USER role
    const isAuthUser = await prisma.user_auth.findFirst({
      where: {
        id: user.id,
        role: "USER",
      },
    });

    if (!isAuthUser) {
      return notFoundRes(
        res,
        "Something went wrong, user authenticity invalid.",
      );
    }

    // 2. Fetch data mapped to the correct foreign key column (userId)
    const fetchOwnSubmittedData = await prisma.player_details.findMany({
      where: {
        userId: user.id, // ✅ Fixed from 'id' to 'userId'
      },
      include: {
        playerDocuments: true,
        competitionPlayed: true,
      },
    });

    // 3. Direct response without weird JSX-like casting brackets
    res.status(200).json(fetchOwnSubmittedData);
    return;
  } catch (error: unknown) {
    console.error("Fetch records error:", error);
    return internalServerError(res, (error as Error).message);
  }
};

export default fetchDetailsByAuthUsersCtrl;
