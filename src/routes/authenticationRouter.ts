import { Router } from "express";
import registrationInitCtrl from "../controllers/authentication/registration/registrationInitCtrl";
import registrationVerificationCtrl from "../controllers/authentication/registration/registrationVerificationCtrl";


const authenticationRouter = Router();


// 1. Initialize User Registration
authenticationRouter.post("/registration-init", registrationInitCtrl)

// 2. Verify User and Add to database.
authenticationRouter.post("/verify-otp", registrationVerificationCtrl)

export default authenticationRouter;