import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  authRequireRes,
  badRequestRes,
  notFoundRes,
  unprocessableRes,
} from "../../../utils/responses/clientError";
import { internalServerError } from "../../../utils/responses/serverError";
import primaryEmailValidator from "../../../utils/primaryEmailValidator";
import prisma from "../../../../prisma";
import tokenGenerator from "../../../utils/tokenGenerator";

const userLoginCtrl = async (req: Request, res: Response): Promise<void> => {
  const { emailId, password }: { emailId: string; password: string } = req.body;

  if (!emailId && !password)
    return badRequestRes(res, "All fields are require to proceed.");

  try {
    const isValidEmailSyntax = primaryEmailValidator(emailId);
    if (!isValidEmailSyntax)
      return unprocessableRes(res, "Email syntax is not valid.");

    const isUserExist = await prisma.user_auth.findUnique({
      where: {
        emailId: emailId,
      },
    });

    if (!isUserExist) {
      notFoundRes(res, "Requested user does not exist.");
    } else {
      const isPasswordMatch = await bcrypt.compare(
        password,
        isUserExist.password,
      );

      if (!isPasswordMatch) {
        // If user is authentic then they know email is valid so they will re-type password.
        // If user is not authentic then he or she will be confuse.
        return authRequireRes(res, "Email or password is incorrect.");
      } else {
        const tokenPayload = {
          id: isUserExist.id,
          fullName: isUserExist.fullName,
          emailId: isUserExist.emailId,
          role: isUserExist.role,
        };

        // Call Token Generator function to handle the next 
        await tokenGenerator(`user_authorization_token`, tokenPayload, res);
      }
    }
  } catch (error: unknown) {
    return internalServerError(res, (error as Error).message);
  }
};

export default userLoginCtrl;
