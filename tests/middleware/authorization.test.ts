import { beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";

const mockFindFirst = vi.fn();

vi.mock("../../prisma", () => ({
  default: {
    user_auth: {
      findFirst: mockFindFirst,
    },
  },
}));

const createMockResponse = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
  };

  return res;
};

describe("authorization middleware", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    mockFindFirst.mockReset();
  });

  it("returns 401 when the authorization token is missing", async () => {
    const authorization = (await import("../../src/middleware/authorization")).default;
    const req: any = { cookies: {} };
    const res = createMockResponse();
    const next = vi.fn();

    await authorization("USER")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("allows a matching role and attaches the current user", async () => {
    mockFindFirst.mockResolvedValueOnce({
      id: "user-1",
      role: "USER",
      fullName: "Asha",
      emailId: "asha@example.com",
    });

    const authorization = (await import("../../src/middleware/authorization")).default;
    const token = jwt.sign(
      { userId: "user-1", userRole: "USER" },
      "test-secret",
      { algorithm: "HS256", expiresIn: "3d" },
    );
    const req: any = { cookies: { user_authorization_token: token } };
    const res = createMockResponse();
    const next = vi.fn();

    await authorization("USER")(req, res, next);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: "user-1", role: "USER" },
    });
    expect(req.currentUser).toEqual(expect.objectContaining({ id: "user-1" }));
    expect(next).toHaveBeenCalled();
  });

  it("rejects requests when the user role is not permitted", async () => {
    const authorization = (await import("../../src/middleware/authorization")).default;
    const token = jwt.sign(
      { userId: "user-1", userRole: "USER" },
      "test-secret",
      { algorithm: "HS256", expiresIn: "3d" },
    );
    const req: any = { cookies: { user_authorization_token: token } };
    const res = createMockResponse();
    const next = vi.fn();

    await authorization("ADMIN")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
