export interface TypeUserData {
  id: string;
  fullName: string;
  emailId: string;
  password?: string;
  role: "ADMIN" | "USER";
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
