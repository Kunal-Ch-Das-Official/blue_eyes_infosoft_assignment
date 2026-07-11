import { Request, Response } from "express";
import prisma from "../../../prisma";
import { generateAthleteWorkbook } from "../../services/excel/generateAthleteWorkbook";
import { internalServerError } from "../../utils/responses/serverError";
import { TypeAthleteResponse } from "../../types/TypeApiResponse";
import { notFoundRes } from "../../utils/responses/clientError";

export const exportAthletesCtrl = async (req: Request, res: Response) => {
  try {
    const athletes = await prisma.player_details.findMany({
      include: {
        competitionPlayed: true,
        playerDocuments: true,
      },
    });

    if (athletes.length === 0)
      return notFoundRes(res, "No athletes data is exist.");

    const workbook = await generateAthleteWorkbook(
      athletes as unknown as TypeAthleteResponse[],
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="athletes.xlsx"',
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    return internalServerError(res, error);
  }
};
