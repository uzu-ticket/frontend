/**
 * QR payload encoding per integrity doc §2:
 *   base64url(payload) + "." + base64url(signature)
 * where payload = { tid, eid, iat, kid }.
 */
export interface QrPayload {
  tid: string; // ticket id
  eid: string; // event id
  iat: number; // issued-at, unix seconds
  kid: string; // signing key id
}

function base64url(buf: Buffer): string {
  return buf.toString("base64url");
}

export function encodePayload(payload: QrPayload): { encoded: string; bytes: Buffer } {
  const bytes = Buffer.from(JSON.stringify(payload), "utf8");
  return { encoded: base64url(bytes), bytes };
}

export function buildQrCode(payload: QrPayload, signature: Buffer): string {
  const { encoded } = encodePayload(payload);
  return `${encoded}.${base64url(signature)}`;
}

export function parseQrCode(qrCode: string): { payload: QrPayload; payloadBytes: Buffer; signature: Buffer } {
  const [encodedPayload, encodedSignature] = qrCode.split(".");
  if (!encodedPayload || !encodedSignature) {
    throw new Error("Malformed QR code");
  }
  const payloadBytes = Buffer.from(encodedPayload, "base64url");
  const payload = JSON.parse(payloadBytes.toString("utf8")) as QrPayload;
  const signature = Buffer.from(encodedSignature, "base64url");
  return { payload, payloadBytes, signature };
}
