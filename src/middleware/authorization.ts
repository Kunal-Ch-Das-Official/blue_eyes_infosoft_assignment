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
    const userCookie = req.cookies?.user_authorization_token;
    const adminCookie = req.cookies?.admin_authorization_token;

    // 🎯 FIX: Select the cookie dynamically based on what the route demands
    let token: string | undefined;

    if (allowedRoles.includes("ADMIN") && adminCookie) {
      token = adminCookie;
    } else if (allowedRoles.includes("USER") && userCookie) {
      token = userCookie;
    } else {
      // Fallback if the specific cookie isn't there, try the other one
      token = adminCookie ?? userCookie;
    }

    // 1️⃣ Token missing
    if (!token) {
      authRequireRes(res, "Authorization token is missing.");
      return;
    }

    // Helper to clear the correct cookie dynamically
    const clearAuthCookie = () => {
      if (userCookie) res.clearCookie("user_authorization_token", cookieOption);
      if (adminCookie)
        res.clearCookie("admin_authorization_token", cookieOption);
    };

    try {
      // 2️⃣ Verify token
      const decoded = jwt.verify(token, envConfig.jwt_secret) as JwtPayload;

      if (!decoded?.userId || !decoded?.userRole) {
        clearAuthCookie();
        authRequireRes(res, "Invalid authorization token.");
        return;
      }

      // 3️⃣ Role not permitted
      if (!allowedRoles.includes(decoded.userRole)) {
        forbiddenRes(
          res,
          "You do not have permission to access this resource.",
        );
        return;
      }

      // 4️⃣ Find user by ID and role
      const user = await prisma.user_auth.findFirst({
        where: { id: decoded.userId, role: decoded.userRole },
      });

      if (!user) {
        clearAuthCookie();
        unauthorizedRes(res, "You are not authorized to access this resource.");
        return;
      }

      // 5️⃣ Attach user to request
      req.currentUser = user;
      next();
    } catch (error) {
      // 6️⃣ Handle JWT errors cleanly
      if (error instanceof jwt.TokenExpiredError) {
        // Only clear the cookie we actually tried to use
        if (token === adminCookie)
          res.clearCookie("admin_authorization_token", cookieOption);
        if (token === userCookie)
          res.clearCookie("user_authorization_token", cookieOption);

        unauthorizedRes(res, "Session expired. Please log in again.");
        return;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        authRequireRes(res, "Invalid authentication token.");
        return;
      }

      console.error("Authorization error:", error);
      res.status(500).json({ message: "Internal server error." });
      return;
    }
  };
};
export default authorization;
