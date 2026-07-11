import express from "express";
import request from "supertest";
import { describe, expect, it, vi, beforeEach } from "vitest";

const mockAuthorization = vi.fn();
const mockSubmitNewFormCtrl = vi.fn();
const mockFetchAthleteDetailsCtrl = vi.fn();
const mockFetchDetailsByAuthUsersCtrl = vi.fn();
const mockDeleteAthleteDetailsCtrl = vi.fn();
const mockVerifyAthleteEmailIdCtrl = vi.fn();
const mockUpdateFormStatusCtrl = vi.fn();
const mockExportAthletesCtrl = vi.fn();
const mockRegistrationInitCtrl = vi.fn();
const mockRegistrationVerificationCtrl = vi.fn();
const mockUserLoginCtrl = vi.fn();
const mockAdminLoginCtrl = vi.fn();
const mockGetLoggedInUserCtrl = vi.fn();
const mockLogoutUserCtrl = vi.fn();
const mockFileUploader = { fields: vi.fn(() => (_req: any, _res: any, next: any) => next()) };

vi.mock("../../src/middleware/authorization", () => ({
  default: (...roles: string[]) => {
    mockAuthorization(roles);
    return (_req: any, _res: any, next: any) => next();
  },
}));

vi.mock("../../src/middleware/fileUploader", () => ({
  default: mockFileUploader,
}));

vi.mock("../../src/controllers/athlete-registration/submitNewFormCtrl", () => ({
  default: mockSubmitNewFormCtrl,
}));
vi.mock("../../src/controllers/athlete-registration/fetchAthleteDetailsCtrl", () => ({
  default: mockFetchAthleteDetailsCtrl,
}));
vi.mock("../../src/controllers/athlete-registration/fetchDetailsByAuthUsersCtrl", () => ({
  default: mockFetchDetailsByAuthUsersCtrl,
}));
vi.mock("../../src/controllers/athlete-registration/deleteAthleteDetailsCtrl", () => ({
  default: mockDeleteAthleteDetailsCtrl,
}));
vi.mock("../../src/controllers/athlete-registration/verifyAthleteEmailIdCtrl", () => ({
  default: mockVerifyAthleteEmailIdCtrl,
}));
vi.mock("../../src/controllers/athlete-registration/updateFormStatusCtrl", () => ({
  default: mockUpdateFormStatusCtrl,
}));
vi.mock("../../src/controllers/athlete-registration/exportToExcelCtrl", () => ({
  exportAthletesCtrl: mockExportAthletesCtrl,
}));
vi.mock("../../src/controllers/authentication/registration/registrationInitCtrl", () => ({
  default: mockRegistrationInitCtrl,
}));
vi.mock("../../src/controllers/authentication/registration/registrationVerificationCtrl", () => ({
  default: mockRegistrationVerificationCtrl,
}));
vi.mock("../../src/controllers/authentication/login/userLoginCtrl", () => ({
  default: mockUserLoginCtrl,
}));
vi.mock("../../src/controllers/authentication/login/adminLoginCtrl", () => ({
  default: mockAdminLoginCtrl,
}));
vi.mock("../../src/controllers/authentication/getLoggedInUserCtrl", () => ({
  default: mockGetLoggedInUserCtrl,
}));
vi.mock("../../src/controllers/authentication/logoutUserCtrl", () => ({
  default: mockLogoutUserCtrl,
}));

describe("express routers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmitNewFormCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockFetchAthleteDetailsCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockFetchDetailsByAuthUsersCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockDeleteAthleteDetailsCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockVerifyAthleteEmailIdCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockUpdateFormStatusCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockExportAthletesCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockRegistrationInitCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockRegistrationVerificationCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockUserLoginCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockAdminLoginCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockGetLoggedInUserCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
    mockLogoutUserCtrl.mockImplementation((_req: any, res: any) => res.status(200).json({ ok: true }));
  });

  it("mounts the athlete registration routes", async () => {
    const athleteRegistrationRouter = (await import("../../src/routes/athleteRegistrationRouter")).default;
    const app = express();
    app.use(athleteRegistrationRouter);

    const response = await request(app).post("/form-verification");
    expect(response.status).toBe(200);
  });

  it("mounts the authentication routes", async () => {
    const authenticationRouter = (await import("../../src/routes/authenticationRouter")).default;
    const app = express();
    app.use(authenticationRouter);

    const response = await request(app).post("/registration-init");
    expect(response.status).toBe(200);
  });

  it("mounts the health check route", async () => {
    const healthCheck = (await import("../../src/routes/healthCheck")).default;
    const app = express();
    app.use(healthCheck);

    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
  });
});
