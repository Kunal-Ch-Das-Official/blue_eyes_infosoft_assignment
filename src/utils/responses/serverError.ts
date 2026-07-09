import { Response } from "express";

const badGatewayError = (res: Response, details: string): void => {
  res.status(502).json({
    message: "Bad Gateway!",
    statusCode: 502,
    details,
  });
};

const internalServerError = (res: Response, details: string): void => {
  res.status(500).json({
    message: "Internal Server Error!",
    statusCode: 500,
    details: details || "Something went wrong, please try again later, or contact to support.",
  });
};

const notImplementedError = (res: Response, details: string): void => {
  res.status(501).json({
    message: "Not Implemented Error!",
    statusCode: 501,
    details,
  });
};

export { badGatewayError, internalServerError, notImplementedError };
