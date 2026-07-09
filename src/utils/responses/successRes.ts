import { Response } from "express";

const acceptedRes = (res: Response, details: string): void => {
  res.status(202).json({
    message: "Accepted!",
    statusCode: 202,
    details,
  });
};

const createdRes = (res: Response, details: string): void => {
  res.status(201).json({
    message: "Successfully Created!",
    statusCode: 201,
    details,
  });
};

const successRes = (res: Response, details: string): void => {
  res.status(200).json({
    message: "Successful!",
    statusCode: 200,
    details,
  });
};

export { acceptedRes, createdRes, successRes };
