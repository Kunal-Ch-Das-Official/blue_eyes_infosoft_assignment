import { describe, expect, it } from "vitest";
import { calculateAge, parseDate } from "../../src/utils/calculateAge";

describe("calculateAge", () => {
  it("parses DD/MM/YYYY strings into dates", () => {
    const parsed = parseDate("11/07/1995");

    expect(parsed.getFullYear()).toBe(1995);
    expect(parsed.getMonth()).toBe(6);
    expect(parsed.getDate()).toBe(11);
  });

  it("parses ISO date strings", () => {
    const parsed = parseDate("1995-07-11");

    expect(parsed.getFullYear()).toBe(1995);
    expect(parsed.getMonth()).toBe(6);
    expect(parsed.getDate()).toBe(11);
  });

  it("returns an invalid date for malformed input", () => {
    const parsed = parseDate("not-a-date");

    expect(parsed.toString()).toBe("Invalid Date");
  });

  it("returns a numeric age for a valid date of birth", () => {
    const today = new Date();
    const birthYear = today.getFullYear() - 25;
    const dob = `${birthYear}-01-01`;

    expect(calculateAge(dob)).toBeGreaterThanOrEqual(24);
    expect(calculateAge(dob)).toBeLessThanOrEqual(25);
  });
});
