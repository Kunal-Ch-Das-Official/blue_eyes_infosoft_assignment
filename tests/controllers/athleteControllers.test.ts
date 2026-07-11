import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";

const mockFindUnique = vi.fn();
const mockFindMany = vi.fn();
const mockDelete = vi.fn();
const mockUpdate = vi.fn();
const mockCreate = vi.fn();
const mockCreateMany = vi.fn();
const mockTransaction = vi.fn();
const mockUserAuthFindFirst = vi.fn();
const mockGet = vi.fn();
const mockDel = vi.fn();
const mockIncr = vi.fn();
const mockExpire = vi.fn();
const mockDestroy = vi.fn();
const mockBlobDestroyer = vi.fn();
const mockUploadBlobData = vi.fn();
const mockSendVerificationOTP = vi.fn();
const mockGenerateWorkbook = vi.fn();
const mockSetex = vi.fn();

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("../../prisma", () => ({
  default: {
    player_details: {
      findUnique: mockFindUnique,
      findMany: mockFindMany,
      delete: mockDelete,
      update: mockUpdate,
      create: mockCreate,
    },
    user_auth: {
      findFirst: mockUserAuthFindFirst,
    },
    players_document: {
      createMany: mockCreateMany,
    },
    competition_played: {
      createMany: mockCreateMany,
    },
    $transaction: mockTransaction,
  },
}));

vi.mock("../../src/redis/redisClient", () => ({
  default: {
    get: mockGet,
    del: mockDel,
    incr: mockIncr,
    expire: mockExpire,
    setex: mockSetex,
  },
}));

vi.mock("../../src/services/blob-upload/multipleBlobDestroyer", () => ({
  default: mockDestroy,
}));

vi.mock("../../src/services/blob-upload/blobDestroyer", () => ({
  default: mockBlobDestroyer,
}));

vi.mock("../../src/services/blob-upload/uploadBlobData", () => ({
  default: mockUploadBlobData,
}));

vi.mock("../../src/services/emails/sendVerificationOTP", () => ({
  default: mockSendVerificationOTP,
}));

vi.mock("../../src/services/excel/generateAthleteWorkbook", () => ({
  generateAthleteWorkbook: mockGenerateWorkbook,
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

describe("athlete controllers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUnique.mockReset();
    mockFindMany.mockReset();
    mockDelete.mockReset();
    mockUpdate.mockReset();
    mockCreate.mockReset();
    mockCreateMany.mockReset();
    mockTransaction.mockReset();
    mockUserAuthFindFirst.mockReset();
    mockGet.mockReset();
    mockDel.mockReset();
    mockIncr.mockReset();
    mockExpire.mockReset();
    mockDestroy.mockReset();
    mockBlobDestroyer.mockReset();
    mockUploadBlobData.mockReset();
    mockSendVerificationOTP.mockReset();
    mockGenerateWorkbook.mockReset();
    mockSetex.mockReset();
  });

  it("fetch athlete details returns 401 for non-admin users", async () => {
    const fetchAthleteDetailsCtrl = (await import("../../src/controllers/athlete-registration/fetchAthleteDetailsCtrl")).default;
    const req = { currentUser: { role: "USER" }, params: {} } as unknown as Request;
    const res = createMockResponse();

    await fetchAthleteDetailsCtrl(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("delete controller removes an athlete when admin requests it", async () => {
    const deleteAthleteDetailsCtrl = (await import("../../src/controllers/athlete-registration/deleteAthleteDetailsCtrl")).default;
    mockDelete.mockResolvedValueOnce({ id: "p1" });

    const req = { currentUser: { role: "ADMIN" }, params: { id: "p1" } } as unknown as Request;
    const res = createMockResponse();

    await deleteAthleteDetailsCtrl(req, res);

    expect(mockDelete).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("fetch own data controller returns the signed-in user's submissions", async () => {
    const fetchDetailsByAuthUsersCtrl = (await import("../../src/controllers/athlete-registration/fetchDetailsByAuthUsersCtrl")).default;
    mockUserAuthFindFirst.mockResolvedValueOnce({ id: "u1", role: "USER" });
    mockFindMany.mockResolvedValueOnce([{ id: "p1" }]);

    const req = { currentUser: { id: "u1", role: "USER" } } as unknown as Request;
    const res = createMockResponse();

    await fetchDetailsByAuthUsersCtrl(req, res);

    expect(mockFindMany).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("update form status uses the provided status and response payload", async () => {
    const updateFormStatusCtrl = (await import("../../src/controllers/athlete-registration/updateFormStatusCtrl")).default;
    mockFindUnique.mockResolvedValueOnce({ id: "p1", emailAddress: "a@example.com", playerName: "Asha" });
    mockUpdate.mockResolvedValueOnce({});

    const req = { query: { formDataId: "p1", status: "APPROVED" } } as unknown as Request;
    const res = createMockResponse();

    await updateFormStatusCtrl(req, res);

    expect(mockUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("export controller returns a workbook attachment when data exists", async () => {
    const { exportAthletesCtrl } = await import("../../src/controllers/athlete-registration/exportToExcelCtrl");
    mockFindMany.mockResolvedValueOnce([{ id: "p1" }]);
    mockGenerateWorkbook.mockResolvedValueOnce({ xlsx: { write: vi.fn().mockResolvedValue(undefined) } });

    const req = {} as Request;
    const res = createMockResponse();

    await exportAthletesCtrl(req, res);

    expect(mockFindMany).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalled();
  });

  it("submit controller stores athlete data when verification payload exists", async () => {
    const submitNewFormCtrl = (await import("../../src/controllers/athlete-registration/submitNewFormCtrl")).default;
    mockGet.mockResolvedValueOnce(JSON.stringify({ reqBody: { dateOfBirth: "11/07/1995", playerName: "Asha", fathersName: "Father", mothersName: "Mother", gender: "FEMALE", emailAddress: "asha@example.com", contactNumber: "9876543210", alternateMobileNo: "9876543210", address: "x", pinCode: "123456", stateOrProvince: "Y", country: "Z", club: "C", sports: "T", competitions: [] }, uploadPlayersDocument: [], uploadProfilePhoto: { documentUrl: "u", documentAccessUrl: "a" } }));
    mockTransaction.mockResolvedValueOnce(undefined);

    const req = { currentUser: { id: "u1" }, body: { verificationOtp: "123456" } } as unknown as Request;
    const res = createMockResponse();

    await submitNewFormCtrl(req, res);

    expect(mockTransaction).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("verify email controller sends an OTP when email is different from the signed-in account", async () => {
    const verifyAthleteEmailIdCtrl = (await import("../../src/controllers/athlete-registration/verifyAthleteEmailIdCtrl")).default;
    mockUploadBlobData.mockResolvedValueOnce({ documentAccessUrl: "blob-url" });
    mockUploadBlobData.mockResolvedValueOnce({ documentAccessUrl: "blob-url-2" });
    mockSendVerificationOTP.mockResolvedValueOnce(undefined);
    mockSetex.mockResolvedValueOnce("OK");

    const req = {
      currentUser: { id: "u1", role: "USER", emailId: "owner@example.com" },
      body: {
        fileTitles: JSON.stringify(["doc1"]),
        competitions: JSON.stringify([]),
        playerName: "Asha",
        fathersName: "Father",
        mothersName: "Mother",
        dateOfBirth: "11/07/1995",
        gender: "FEMALE",
        emailAddress: "new@example.com",
        contactNumber: "9876543210",
        alternateMobileNo: "9876543210",
        address: "x",
        pinCode: "123456",
        stateOrProvince: "Y",
        country: "Z",
        club: "C",
        sports: "T",
      },
      files: {
        profile_photo: [{ originalname: "a.jpg" }],
        players_document: [{ originalname: "b.pdf" }],
      },
    } as unknown as Request;
    const res = createMockResponse();

    await verifyAthleteEmailIdCtrl(req, res);

    expect(mockSendVerificationOTP).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
