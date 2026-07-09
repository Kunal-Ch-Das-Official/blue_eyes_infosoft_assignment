import { Response } from "express";

const authRequireRes = (res: Response, details: string): void => {
  res.status(401).json({
    message: "Authentication Required!",
    statusCode: 401,
    details,
  });
};

const badRequestRes = (res: Response, details: string): void => {
  res.status(400).json({
    message: "Bad Request!",
    statusCode: 400,
    details,
  });
};

const conflictRes = (res: Response, details: string): void => {
  res.status(409).json({
    message: "Conflict!",
    statusCode: 409,
    details,
  });
};

const forbiddenRes = (res: Response, details: string): void => {
  res.status(403).json({
    message: "Forbidden!",
    statusCode: 403,
    details,
  });
};

const notFoundRes = (res: Response, details: string): void => {
  res.status(404).json({
    message: "Not Found!",
    statusCode: 404,
    details,
  });
};

const unauthorizedRes = (res: Response, details: string): void => {
  res.status(401).json({
    message: "Unauthorized!",
    statusCode: 401,
    details,
  });
};

const unprocessableRes = (res: Response, details: string): void => {
  res.status(422).json({
    message: "Unprocessable!",
    statusCode: 422,
    details,
  });
};

export {
  authRequireRes,
  badRequestRes,
  conflictRes,
  forbiddenRes,
  notFoundRes,
  unauthorizedRes,
  unprocessableRes,
};
