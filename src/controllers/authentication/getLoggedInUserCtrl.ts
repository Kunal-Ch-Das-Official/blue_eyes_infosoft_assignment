import { Request, Response } from "express";
import { unauthorizedRes } from "../../utils/responses/clientError";

const getLoggedInUserCtrl = async (req: Request, res: Response): Promise<void> => {
  const currentUser = req.currentUser;

  if (!currentUser)
    return unauthorizedRes(res, "Logged in user was not found.");

  res.status(200).json(currentUser);
};

export default getLoggedInUserCtrl;
