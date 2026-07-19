import { bpsOf, calculatePlatformFee, minorToMajorString } from "./money";

describe("money", () => {
  describe("bpsOf", () => {
    it("computes basis points correctly", () => {
      expect(bpsOf(10_000n, 500)).toBe(500n); // 5% of 10000
      expect(bpsOf(0n, 500)).toBe(0n);
      expect(bpsOf(999n, 500)).toBe(49n); // integer division rounds down
    });
  });

  describe("calculatePlatformFee", () => {
    it("returns all-zero for a free order", () => {
      expect(calculatePlatformFee(0n, 500, 10_000n)).toEqual({
        subtotalMinor: 0n,
        platformFeeMinor: 0n,
        totalMinor: 0n,
      });
    });

    it("adds percentage + fixed fee on top of subtotal", () => {
      const result = calculatePlatformFee(100_000n, 500, 10_000n);
      expect(result.platformFeeMinor).toBe(15_000n); // 5% of 100000 = 5000, + 10000 fixed
      expect(result.totalMinor).toBe(115_000n);
    });
  });

  describe("minorToMajorString", () => {
    it("formats positive amounts", () => {
      expect(minorToMajorString(123_456n, "NGN")).toBe("NGN 1234.56");
    });

    it("formats negative amounts", () => {
      expect(minorToMajorString(-500n, "NGN")).toBe("-NGN 5.00");
    });

    it("pads sub-100 minor units", () => {
      expect(minorToMajorString(5n, "NGN")).toBe("NGN 0.05");
    });
  });
});
