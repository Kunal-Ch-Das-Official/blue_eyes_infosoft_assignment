export interface TypeAthleteForm {
  playerName: string;
  fathersName: string;
  mothersName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHERS";
  emailAddress: string;
  contactNumber: string;
  alternateMobileNo: string;
  nationality: string;
  bloodGroup:
    | "A_POSITIVE"
    | "A_NEGATIVE"
    | "B_POSITIVE"
    | "B_NEGATIVE"
    | "A_B_POSITIVE"
    | "A_B_NEGATIVE"
    | "O_POSITIVE"
    | "O_NEGATIVE"
    | "NOT_KNOWN";

  height?: string;
  weight?: string;
  governmentIdProofNo?: string;
  address: string;
  pinCode: string;
  stateOrProvince: string;
  country: string;
  club: string;
  sports: string;
  fileTitles?: string[];
  competitions?: {
    competitionName: string;
    sports: string;
    category?: string;
    position?: string;
  }[];
}
