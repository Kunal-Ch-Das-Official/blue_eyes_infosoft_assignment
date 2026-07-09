import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import { TypeUserData } from "../types/TypeUserData";
import {
  authRequireRes,
  forbiddenRes,
  unauthorizedRes,
} from "../utils/responses/clientError";
import envConfig from "../config/envConfig";
import prisma from "../../prisma";
import { cookieOption } from "../services/cookies/cookiesOption";

interface JwtPayload extends DefaultJwtPayload {
  userId: string;
  userRole: "USER" | "ADMIN";
}

declare module "express-serve-static-core" {
  interface Request {
    currentUser?: TypeUserData;
  }
}

const authorization = (...allowedRoles: JwtPayload["userRole"][]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.cookies?.authorization_token;

    // 1️⃣ Token missing
    if (!token) return authRequireRes(res, "Authorization token is missing.");

    try {
      // 2️⃣ Verify token
      const decoded = jwt.verify(token, envConfig.jwt_secret) as JwtPayload;

      if (!decoded?.userId || !decoded?.userRole) {
        return authRequireRes(
          res,
          "Invalid authorization token. Or if expired, please login again.",
        );
      }

      // 3️⃣ Role not permitted
      if (!allowedRoles.includes(decoded.userRole)) {
        return forbiddenRes(
          res,
          "You do not have permission to access this resource.",
        );
      }

      // 4️⃣ Find user by ID and role
      const user = await prisma.user_auth.findFirst({
        where: { id: decoded.userId, role: decoded.userRole },
      });

      if (!user) {
        res.clearCookie("authorization_token", cookieOption);
        return unauthorizedRes(
          res,
          "You are not authorized to access this resource.",
        );
      }

      // 5️⃣ Attach user to request
      req.currentUser = user;
      next();
    } catch (error) {
      // 6️⃣ Handle JWT errors
      if (error instanceof jwt.TokenExpiredError) {
        res.clearCookie("authorization_token", cookieOption);
        return unauthorizedRes(res, "Session expired. Please log in again.");
      }

      if (error instanceof jwt.JsonWebTokenError) {
        res.clearCookie("authorization_token", cookieOption);
        return authRequireRes(res, "Invalid authentication token.");
      }

      console.error("Authorization error:", error);
      return <any>res.status(500).json({ message: "Internal server error." });
    }
  };
};

export default authorization;
