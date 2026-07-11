import { describe, expect, it, vi } from "vitest";
import primaryEmailValidator from "../../src/utils/primaryEmailValidator";
import passwordSalting from "../../src/utils/passwordSalting";
import { acceptedRes, createdRes, successRes } from "../../src/utils/responses/successRes";
import {
  authRequireRes,
  badRequestRes,
  conflictRes,
  forbiddenRes,
  notFoundRes,
  unauthorizedRes,
  unprocessableRes,
} from "../../src/utils/responses/clientError";
import {
  badGatewayError,
  internalServerError,
  notImplementedError,
} from "../../src/utils/responses/serverError";

const createMockResponse = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };

  return res;
};

describe("utility validators", () => {
  it("accepts only well-formed email addresses", () => {
    expect(primaryEmailValidator("user@example.com")).toBe(true);
    expect(primaryEmailValidator("user@example.co.uk")).toBe(true);
    expect(primaryEmailValidator("user@example")).toBe(false);
    expect(primaryEmailValidator("user")).toBe(false);
    expect(primaryEmailValidator("user@exam_ple.com")).toBe(false);
  });

  it("hashes passwords into bcrypt strings", async () => {
    const hashed = await passwordSalting("super-secret");

    expect(hashed).toMatch(/^\$2[aby]\$\d{2}\$/);
    expect(hashed.length).toBeGreaterThan(20);
  });
});

describe("response helpers", () => {
  it("writes success payloads with the right status codes", () => {
    const res = createMockResponse();

    successRes(res, "ok");
    createdRes(res, "created");
    acceptedRes(res, "accepted");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalled();
  });

  it("writes client error payloads with the expected status codes", () => {
    const res = createMockResponse();

    authRequireRes(res, "missing");
    badRequestRes(res, "bad");
    conflictRes(res, "conflict");
    forbiddenRes(res, "forbidden");
    notFoundRes(res, "missing");
    unauthorizedRes(res, "nope");
    unprocessableRes(res, "unprocessable");

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalled();
  });

  it("writes server error payloads with the expected status codes", () => {
    const res = createMockResponse();

    badGatewayError(res, "bad gateway");
    internalServerError(res, "server exploded");
    notImplementedError(res, "not ready");

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalled();
  });
});
