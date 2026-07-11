import ExcelJS from "exceljs";
import { TypeAthleteResponse } from "../../types/TypeApiResponse";

export const generateAthleteWorkbook = async (
  athletes: TypeAthleteResponse[],
): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Athlete Registry Roster");

  // Define static base columns along with competition and document fields
  worksheet.columns = [
    { header: "Form Status", key: "formStatus", width: 15 },
    { header: "Player Name", key: "playerName", width: 25 },
    { header: "Profile Photo Url", key: "playersPhotoUrl", width: 40 },
    { header: "Father's Name", key: "fathersName", width: 25 },
    { header: "Mother's Name", key: "mothersName", width: 25 },
    { header: "Date of Birth", key: "dateOfBirth", width: 15 },
    { header: "Current Age", key: "currentAge", width: 12 },
    { header: "Gender", key: "gender", width: 12 },
    { header: "Email Address", key: "emailAddress", width: 30 },
    { header: "Contact Number", key: "contactNumber", width: 20 },
    { header: "Alternate Mobile", key: "alternateMobileNo", width: 20 },
    { header: "Club Affiliation", key: "club", width: 25 },
    { header: "Primary Sport", key: "sports", width: 20 },
    { header: "Residential Address", key: "address", width: 35 },
    { header: "Pin Code", key: "pinCode", width: 12 },
    { header: "State/Province", key: "stateOrProvince", width: 20 },
    { header: "Country", key: "country", width: 15 },

    // Relational Competition Data Fields
    { header: "Competition Name", key: "compName", width: 30 },
    { header: "Competition Sport", key: "compSport", width: 20 },
    { header: "Competition Category", key: "compCategory", width: 20 },
    { header: "Playing Position", key: "compPosition", width: 18 },
    { header: "Registration Date", key: "createdAt", width: 20 },

    // Relational Documents Fields
    { header: "Document Name", key: "docName", width: 25 },
    { header: "Document Type", key: "docType", width: 15 },
    { header: "Document URL", key: "docUrl", width: 40 },
  ];

  // Base row height configuration
  const baseDataRowHeight = 20;

  // Loop through all athletes
  athletes.forEach((athlete) => {
    const competitions = athlete.competitionPlayed || [];
    const documents = athlete.playerDocuments || [];

    // Map relations to line-break separated strings
    const compNames = competitions
      .map((c) => c?.competitionName || "N/A")
      .join("\n");
    const compSports = competitions.map((c) => c?.sports || "N/A").join("\n");
    const compCategories = competitions
      .map((c) => c?.category || "N/A")
      .join("\n");
    const compPositions = competitions
      .map((c) => c?.position || "N/A")
      .join("\n");

    const docNames = documents.map((d) => d?.documentName || "N/A").join("\n");
    const docTypes = documents.map((d) => d?.documentType || "N/A").join("\n");
    const docUrls = documents.map((d) => d?.documentUrl || "N/A").join("\n");

    // Add a single row per athlete
    const newRow = worksheet.addRow({
      formStatus: athlete.formStatus,
      playerName: athlete.playerName,
      playersPhotoUrl: athlete.playersPhotoUrl,
      fathersName: athlete.fathersName,
      mothersName: athlete.mothersName,
      dateOfBirth:
        athlete.dateOfBirth instanceof Date
          ? athlete.dateOfBirth.toLocaleDateString()
          : athlete.dateOfBirth?.toString().split("T")[0],
      currentAge: athlete.currentAge,
      gender: athlete.gender,
      emailAddress: athlete.emailAddress,
      contactNumber: athlete.contactNumber,
      alternateMobileNo: athlete.alternateMobileNo || "N/A",
      club: athlete.club,
      sports: athlete.sports,
      address: athlete.address,
      pinCode: athlete.pinCode,
      stateOrProvince: athlete.stateOrProvince,
      country: athlete.country,
      createdAt:
        athlete.createdAt instanceof Date
          ? athlete.createdAt.toLocaleString()
          : athlete.createdAt?.toString().replace("T", " ").substring(0, 19),

      // Multi-line values
      compName: compNames || "N/A",
      compSport: compSports || "N/A",
      compCategory: compCategories || "N/A",
      compPosition: compPositions || "N/A",
      docName: docNames || "N/A",
      docType: docTypes || "N/A",
      docUrl: docUrls || "N/A",
    });

    // Calculate dynamic row height based on your logic
    const biggerLen =
      competitions.length > documents.length
        ? competitions.length
        : documents.length;
    const finalMultiplier = biggerLen > 0 ? biggerLen : 1;
    newRow.height = finalMultiplier * baseDataRowHeight;
  });

  // Define the border style configuration
  const thinBorder = {
    top: { style: "thin", color: { argb: "FFCBD5E1" } },
    left: { style: "thin", color: { argb: "FFCBD5E1" } },
    bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
    right: { style: "thin", color: { argb: "FFCBD5E1" } },
  } as ExcelJS.Borders;

  // Iterate dynamically over rows and cells to apply styling and alignment
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) {
      // Apply Custom Header Styles
      row.height = 26;
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = {
          name: "Calibri",
          size: 11,
          bold: true,
          color: { argb: "FF1E293B" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF93C5FD" },
        };
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = thinBorder;
      });
    } else {
      // Apply Data Row Styles
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = thinBorder;
        cell.alignment = {
          vertical: "middle",
          horizontal: "left",
          wrapText: true, // Crucial: Allows Excel to render the "\n" tags correctly
        };
      });
    }
  });

  return workbook;
};
