import { describe, it, expect } from "vitest";
import {
  formatKRW,
  formatMonthKR,
  getTodayString,
  getCurrentMonth,
  generateId,
  getMonthFromDate,
  getPrevMonth,
  getNextMonth,
  calcPercent,
} from "../lib/utils";

describe("formatKRW", () => {
  it("formats zero correctly", () => {
    expect(formatKRW(0)).toBe("0원");
  });
  it("formats positive amount with commas", () => {
    expect(formatKRW(1234567)).toBe("1,234,567원");
  });
  it("formats with sign when showSign is true", () => {
    expect(formatKRW(50000, true)).toBe("+50,000원");
    expect(formatKRW(-50000, true)).toBe("-50,000원");
  });
});

describe("formatMonthKR", () => {
  it("formats month string to Korean", () => {
    expect(formatMonthKR("2026-04")).toBe("2026년 4월");
    expect(formatMonthKR("2025-12")).toBe("2025년 12월");
  });
});

describe("getTodayString", () => {
  it("returns YYYY-MM-DD format", () => {
    const result = getTodayString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getCurrentMonth", () => {
  it("returns YYYY-MM format", () => {
    const result = getCurrentMonth();
    expect(result).toMatch(/^\d{4}-\d{2}$/);
  });
});

describe("generateId", () => {
  it("generates unique IDs", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });
  it("returns a non-empty string", () => {
    expect(generateId().length).toBeGreaterThan(0);
  });
});

describe("getMonthFromDate", () => {
  it("extracts YYYY-MM from date string", () => {
    expect(getMonthFromDate("2026-04-24")).toBe("2026-04");
    expect(getMonthFromDate("2025-12-31")).toBe("2025-12");
  });
});

describe("getPrevMonth", () => {
  it("returns previous month", () => {
    expect(getPrevMonth("2026-04")).toBe("2026-03");
    expect(getPrevMonth("2026-01")).toBe("2025-12");
  });
});

describe("getNextMonth", () => {
  it("returns next month", () => {
    expect(getNextMonth("2026-04")).toBe("2026-05");
    expect(getNextMonth("2026-12")).toBe("2027-01");
  });
});

describe("calcPercent", () => {
  it("returns 0 when total is 0", () => {
    expect(calcPercent(100, 0)).toBe(0);
  });
  it("calculates percentage correctly", () => {
    expect(calcPercent(50, 100)).toBe(50);
    expect(calcPercent(75, 100)).toBe(75);
  });
  it("clamps at 100 when over budget", () => {
    expect(calcPercent(150, 100)).toBe(100);
  });
});
