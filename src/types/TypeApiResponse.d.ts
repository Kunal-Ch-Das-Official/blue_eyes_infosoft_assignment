import { UpdateDataI } from "../type-files/TypeFiles";

export interface TypeApiResponse {
  message: string; 
  statusCode: number; 
  details: string;
}

export interface TypePlayersDocumentRes {
  id: string;
  documentName: string;
  documentType: string;
  documentUrl: string;
  documentAccessUrl: string;
  documentSize: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  playerId: string;
}

export interface TypeCompetitionPlayedRes {
  id: string;
  competitionName: string;
  sports: string;
  category?: string;
  position?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  playerId: string;
}

export interface TypeAthleteResponse {
  id: string;
  playerName: string;
  fathersName: string;
  mothersName: ˇ;
  dateOfBirth: string | Date;
  currentAge: string | number;
  gender: "MALE" | "FEMALE" | "OTHERS";
  playersPhotoUrl?: string;
  playersPhotoPId?: string;
  emailAddress: string;
  contactNumber: string;
  alternateMobileNo: string;
  address: string;
  pinCode: string;
  stateOrProvince: string;
  country: string;
  club: string;
  sports: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  userId: string;
  formStatus: "APPROVED" | "REJECTED" | "APPLIED";
  playerDocuments: TypePlayersDocumentRes[];
  competitionPlayed: TypeCompetitionPlayedRes[];
}
