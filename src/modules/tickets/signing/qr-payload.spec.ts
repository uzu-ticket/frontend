import { buildQrCode, parseQrCode, QrPayload } from "./qr-payload";

describe("qr-payload", () => {
  const payload: QrPayload = {
    tid: "0190f1e0-1234-7abc-8def-0123456789ab",
    eid: "0190f1e0-5678-7abc-8def-0123456789ab",
    iat: 1_700_000_000,
    kid: "0190f1e0-9999-7abc-8def-0123456789ab",
  };
  const signature = Buffer.from("this-is-a-fake-64-byte-ed25519-signature-padding-padding-pad!!", "utf8");

  it("round-trips payload and signature through build/parse", () => {
    const qrCode = buildQrCode(payload, signature);
    expect(qrCode).toContain(".");

    const parsed = parseQrCode(qrCode);
    expect(parsed.payload).toEqual(payload);
    expect(parsed.signature.equals(signature)).toBe(true);
  });

  it("throws on a malformed code with no separator", () => {
    expect(() => parseQrCode("not-a-valid-qr-code")).toThrow("Malformed QR code");
  });

  it("produces different codes for different payloads (no accidental cross-ticket collision)", () => {
    const other: QrPayload = { ...payload, tid: "different-ticket-id" };
    expect(buildQrCode(payload, signature)).not.toBe(buildQrCode(other, signature));
  });
});
