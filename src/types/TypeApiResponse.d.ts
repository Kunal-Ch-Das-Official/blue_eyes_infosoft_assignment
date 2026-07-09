import { UpdateDataI } from "../type-files/TypeFiles";

export interface TypeApiResponse {
  message: string; // A descriptive message providing information about the response.
  statusCode: number; // The HTTP status code indicating success or failure (e.g., 200, 400, 500).
  details: string; // Additional details providing context about the response (e.g., error description).
}