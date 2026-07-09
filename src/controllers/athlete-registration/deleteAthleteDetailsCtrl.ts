import { Request, Response } from "express";
import {
  internalServerError,
  notImplementedError,
} from "../../utils/responses/serverError";
import {
  badRequestRes,
  unauthorizedRes,
} from "../../utils/responses/clientError";
import prisma from "../../../prisma";
import { successRes } from "../../utils/responses/successRes";

const deleteAthleteDetailsCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id }: { id?: string } = req.params;
  const user = req.currentUser;

  if (!user) return badRequestRes(res, "Please sign up or login to proceed.");

  try {
    if (user.role !== "ADMIN")
      return unauthorizedRes(
        res,
        "You are not authorized to remove this data.",
      );

    const remove = await prisma.player_details.delete({
      where: {
        id: id,
      },
    });

    if (!remove)
      return notImplementedError(
        res,
        "Something went wrong, please check the credential and try.",
      );

    return successRes(res, "Requested data have been removed successfully.");
  } catch (error: unknown) {
    return internalServerError(res, (error as Error).message);
  }
};

export default deleteAthleteDetailsCtrl;
