import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";

const mockFindUnique = vi.fn();
const mockFindFirst = vi.fn();
const mockCreate = vi.fn();
const mockGet = vi.fn();
const mockDel = vi.fn();
const mockSetex = vi.fn();
const mockCompare = vi.fn();
const mockSendVerificationOTP = vi.fn();
const mockSuccessEmail = vi.fn();
const mockTokenGenerator = vi.fn(async (_cookieName: string, _user: unknown, res: Response) => {
  res.status(200).json({ ok: true });
});

vi.mock("bcrypt", () => ({
  default: {
    compare: mockCompare,
  },
}));

vi.mock("../../prisma", () => ({
  default: {
    user_auth: {
      findUnique: mockFindUnique,
      findFirst: mockFindFirst,
      create: mockCreate,
    },
  },
}));

vi.mock("../../src/redis/redisClient", () => ({
  default: {
    get: mockGet,
    del: mockDel,
    setex: mockSetex,
  },
}));

vi.mock("../../src/services/emails/sendVerificationOTP", () => ({
  default: mockSendVerificationOTP,
}));

vi.mock("../../src/services/emails/successEmail", () => ({
  default: mockSuccessEmail,
}));

vi.mock("../../src/utils/tokenGenerator", () => ({
  default: mockTokenGenerator,
}));

const createMockResponse = () => {
  const res: Partial<Response> & { status: any; json: any; clearCookie: any; setHeader: any; end: any; cookie: any } = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
  };
  return res as Response;
};

describe("authentication controllers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUnique.mockReset();
    mockFindFirst.mockReset();
    mockCreate.mockReset();
    mockGet.mockReset();
    mockDel.mockReset();
    mockSetex.mockReset();
    mockCompare.mockReset();
    mockSendVerificationOTP.mockReset();
    mockSuccessEmail.mockReset();
    mockTokenGenerator.mockReset();
    mockTokenGenerator.mockImplementation(async (_cookieName: string, _user: unknown, res: Response) => {
      res.status(200).json({ ok: true });
    });
  });

  it("registration init returns a conflict when email already exists", async () => {
    const registrationInitCtrl = (await import("../../src/controllers/authentication/registration/registrationInitCtrl")).default;
    mockFindFirst.mockResolvedValueOnce({ id: "1" });

    const req = { body: { fullName: "Asha", emailId: "asha@example.com", password: "abc", confirmPassword: "abc" }, query: {} } as unknown as Request;
    const res = createMockResponse();

    await registrationInitCtrl(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("registration verification creates a user when OTP is valid", async () => {
    const registrationVerificationCtrl = (await import("../../src/controllers/authentication/registration/registrationVerificationCtrl")).default;
    mockGet.mockResolvedValueOnce(JSON.stringify({ fullName: "Asha", emailId: "asha@example.com", password: "hashed", role: "USER" }));
    mockCreate.mockResolvedValueOnce({ id: "u1" });
    mockSuccessEmail.mockResolvedValueOnce(undefined);

    const req = { body: { oneTimePassword: "123456" } } as unknown as Request;
    const res = createMockResponse();

    await registrationVerificationCtrl(req, res);

    expect(mockCreate).toHaveBeenCalled();
    expect(mockDel).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("user login returns unauthorized for incorrect password", async () => {
    const userLoginCtrl = (await import("../../src/controllers/authentication/login/userLoginCtrl")).default;
    mockFindUnique.mockResolvedValueOnce({ id: "u1", emailId: "asha@example.com", password: "hash", role: "USER" });
    mockCompare.mockResolvedValueOnce(false);

    const req = { body: { emailId: "asha@example.com", password: "wrong" } } as unknown as Request;
    const res = createMockResponse();

    await userLoginCtrl(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("admin login uses the token generator on a successful login", async () => {
    const adminLoginCtrl = (await import("../../src/controllers/authentication/login/adminLoginCtrl")).default;
    mockFindFirst.mockResolvedValueOnce({ id: "a1", emailId: "admin@example.com", password: "hash", role: "ADMIN", fullName: "Admin" });
    mockCompare.mockResolvedValueOnce(true);

    const req = { body: { emailId: "admin@example.com", password: "secret" }, query: {} } as unknown as Request;
    const res = createMockResponse();

    await adminLoginCtrl(req, res);

    expect(mockCompare).toHaveBeenCalled();
    expect(mockTokenGenerator).toHaveBeenCalled();
  });

  it("get logged in user returns 401 without current user", async () => {
    const getLoggedInUserCtrl = (await import("../../src/controllers/authentication/getLoggedInUserCtrl")).default;
    const req = { currentUser: undefined } as unknown as Request;
    const res = createMockResponse();

    await getLoggedInUserCtrl(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("logout clears the appropriate auth cookie", async () => {
    const logoutUserCtrl = (await import("../../src/controllers/authentication/logoutUserCtrl")).default;
    const req = { currentUser: { role: "USER" } } as unknown as Request;
    const res = createMockResponse();

    await logoutUserCtrl(req, res);

    expect(res.clearCookie).toHaveBeenCalled();
  });
});
