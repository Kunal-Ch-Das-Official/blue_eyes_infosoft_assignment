import { Router } from "express";
import submitNewFormCtrl from "../controllers/athlete-registration/submitNewFormCtrl";
import fileUploader from "../middleware/fileUploader";
import authorization from "../middleware/authorization";
import fetchAthleteDetailsCtrl from "../controllers/athlete-registration/fetchAthleteDetailsCtrl";
import fetchDetailsByAuthUsersCtrl from "../controllers/athlete-registration/fetchDetailsByAuthUsersCtrl";
import deleteAthleteDetailsCtrl from "../controllers/athlete-registration/deleteAthleteDetailsCtrl";
import verifyAthleteEmailIdCtrl from "../controllers/athlete-registration/verifyAthleteEmailIdCtrl";

const athleteRegistrationRouter = Router();

// Submit form
athleteRegistrationRouter.post(
  "/form-verification",
  authorization("USER"),
  fileUploader.fields([
    {
      name: "profile_photo",
      maxCount: 1,
    },
    {
      name: "players_document",
      maxCount: 25,
    },
  ]),
  verifyAthleteEmailIdCtrl
);


athleteRegistrationRouter.post("/submit",  authorization("USER"),  submitNewFormCtrl)


// 2. Fetch All player's details
athleteRegistrationRouter.get(
  "/player-details",
  authorization("ADMIN"),
  fetchAthleteDetailsCtrl,
);

// 3. Fetch player's details by id
athleteRegistrationRouter.get(
  "/player-details/:id",
  authorization("ADMIN"),
  fetchAthleteDetailsCtrl,
);

// 4.
athleteRegistrationRouter.get(
  "/own-data",
  authorization("USER"),
  fetchDetailsByAuthUsersCtrl,
);

athleteRegistrationRouter.delete(
  "/remove/:id",
  authorization("ADMIN"),
  deleteAthleteDetailsCtrl,
);

export default athleteRegistrationRouter;
