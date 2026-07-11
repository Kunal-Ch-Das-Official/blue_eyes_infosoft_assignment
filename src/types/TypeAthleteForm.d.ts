export interface TypeAthleteForm {
  playerName: string;
  fathersName: string;
  mothersName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHERS";
  emailAddress: string;
  contactNumber: string;
  alternateMobileNo: string;
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


