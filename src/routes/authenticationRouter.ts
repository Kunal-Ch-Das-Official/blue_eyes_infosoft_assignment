import { Router } from "express";
import registrationInitCtrl from "../controllers/authentication/registration/registrationInitCtrl";
import registrationVerificationCtrl from "../controllers/authentication/registration/registrationVerificationCtrl";
import userLoginCtrl from "../controllers/authentication/login/userLoginCtrl";
import adminLoginCtrl from "../controllers/authentication/login/adminLoginCtrl";
import getLoggedInUserCtrl from "../controllers/authentication/getLoggedInUserCtrl";
import authorization from "../middleware/authorization";
import logoutUserCtrl from "../controllers/authentication/logoutUserCtrl";

const authenticationRouter = Router();

// 1. Initialize User Registration
authenticationRouter.post("/registration-init", registrationInitCtrl);

// 2. Verify User and Add to database.
authenticationRouter.post("/verify-otp", registrationVerificationCtrl);

// 3. User Login
authenticationRouter.post("/login-user", userLoginCtrl);

// 4. Admin Login
authenticationRouter.post("/admin-login", adminLoginCtrl);

// 5. Get logged in user
authenticationRouter.get(
  "/user/logged-in",
  authorization("ADMIN", "USER"),
  getLoggedInUserCtrl,
);


// 6. Logout Controller 
authenticationRouter.post("/user-logout", authorization("ADMIN", "USER"), logoutUserCtrl)

export default authenticationRouter;
