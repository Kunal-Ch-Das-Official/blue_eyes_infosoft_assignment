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

const adminLoginCtrl = async (req: Request, res: Response): Promise<void> => {
  const {role}:{role?: "ADMIN" | "USER"} = req.query;

  const { emailId, password }: { emailId: string; password: string; } = req.body;

  if (!emailId && !password && !role)
    return badRequestRes(res, "All fields are require to proceed.");

  try {
    const isValidEmailSyntax = primaryEmailValidator(emailId);
    if (!isValidEmailSyntax)
      return unprocessableRes(res, "Email syntax is not valid.");

    const isAdminExist = await prisma.user_auth.findFirst({
      where: {
        OR: [{emailId: emailId, role: "ADMIN"}]
      },
    });

    if (!isAdminExist) {
      notFoundRes(res, "Requested admin user does not exist.");
    } else {
      const isPasswordMatch = await bcrypt.compare(
        password,
        isAdminExist.password,
      );

      if (!isPasswordMatch) {
        // If user is authentic then they know email is valid so they will re-type password.
        // If user is not authentic then he or she will be confuse.
        return authRequireRes(res, "Email or password is incorrect.");
      } else {
        const tokenPayload = {
          id: isAdminExist.id,
          fullName: isAdminExist.fullName,
          emailId: isAdminExist.emailId,
          role: isAdminExist.role,
        };

        // Call Token Generator function to handle the next 
        await tokenGenerator(`admin_access_token`, tokenPayload, res);
      }
    }
  } catch (error: unknown) {
    return internalServerError(res, (error as Error).message);
  }
};

export default adminLoginCtrl;
