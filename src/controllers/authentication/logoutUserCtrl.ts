import { Request, Response } from "express";
import { badRequestRes } from "../../utils/responses/clientError";
import { successRes } from "../../utils/responses/successRes";
import { cookieOption } from "../../services/cookies/cookiesOption";

const logoutUserCtrl = async (req: Request, res: Response): Promise<void> => {
  const isUser = req.currentUser;
  if (!isUser) {
    return badRequestRes(
      res,
      "Logged-in user was not found. Please login before logout. ",
    );
  }

  res.clearCookie("authorization_token", cookieOption);

  return successRes(res, "Requested user has been logged out successfully.");
};

export default logoutUserCtrl;