import { Request, Response } from "express";
import { internalServerError } from "../../utils/responses/serverError";
import {
  notFoundRes,
  unprocessableRes,
} from "../../utils/responses/clientError";
import prisma from "../../../prisma";
import { successRes } from "../../utils/responses/successRes";
import successEmail from "../../services/emails/successEmail";

const updateFormStatusCtrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    formDataId,
    status,
  }: { formDataId?: string; status?: "APPROVED" | "REJECTED" } = req.query;
  try {
    // FIX 1: Use logical OR (||) to ensure both fields exist
    if (!formDataId || !status) {
      return unprocessableRes(
        res,
        "Both form data id and updated status are required to proceed.",
      );
    }

    // Step 1: Find the target profile
    const isFormExist = await prisma.player_details.findUnique({
      where: { id: formDataId },
    });

    if (!isFormExist) {
      return notFoundRes(res, "Requested form details were not found.");
    }

    // Step 2: Update the record status
    await prisma.player_details.update({
      where: { id: formDataId },
      data: { formStatus: status },
    });

    // Step 3: Dispatch email safely in the background
    // Failure to send an email shouldn't mask a successful database write.
    try {
      await successEmail({
        to: isFormExist.emailAddress,
        subject:
          status === "APPROVED"
            ? "Congratulations! Your Profile Has Been Approved"
            : "Update Regarding Your Athlete Profile Application",
        html:
          status === "APPROVED"
            ? `<div style="font-family: sans-serif; color: #334155; line-height: 1.6;">
                <p>Dear <strong>${isFormExist.playerName}</strong>,</p>
                <p>We are pleased to inform you that your profile registration details have been reviewed and officially <strong>approved</strong>.</p>
                <p>Your application met all the required validation parameters, and your profile is now active within our official registry roster.</p>
                <p>We look forward to supporting your athletic journey and providing you with the best experience possible.</p>
                <br />
                <p>Best regards,</p>
                <p><strong>Sports Club Team</strong></p>
               </div>`
            : `<div style="font-family: sans-serif; color: #334155; line-height: 1.6;">
                <p>Dear <strong>${isFormExist.playerName}</strong>,</p>
                <p>Thank you for submitting your profile registration details to our platform.</p>
                <p>After a careful review of your application against our current registry requirements, we regret to inform you that your profile cannot be approved at this time.</p>
                <p>We truly appreciate the time and effort you put into your application, and we wish you the absolute best in your future athletic endeavors.</p>
                <br />
                <p>Best regards,</p>
                <p><strong>Sports Club Team</strong></p>
               </div>`,
      });
    } catch (emailError) {
      // Log it internally so engineers know, but don't break the user request loop
      console.error("Background Email Dispatch Failed:", emailError);
    }

    // Step 4: Final Success Response
    return successRes(res, "Status update successful.");
  } catch (error: unknown) {
    return internalServerError(res, (error as Error).message);
  }
};

export default updateFormStatusCtrl;
