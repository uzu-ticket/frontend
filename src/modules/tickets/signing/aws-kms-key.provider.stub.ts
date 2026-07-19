import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { GeneratedKeyPair, KeyProvider } from "./key-provider";

/**
 * Production swap-in for LocalEncryptedKeyProvider. Not implemented — wire
 * up @aws-sdk/client-kms (GenerateDataKeyPair / Sign) or an equivalent GCP
 * Secret Manager + KMS flow, then rebind KEY_PROVIDER to this class in
 * TicketsModule. No other code changes needed; see key-provider.ts.
 */
@Injectable()
export class AwsKmsKeyProvider implements KeyProvider {
  generateKeyPair(): Promise<GeneratedKeyPair> {
    throw new Error("AwsKmsKeyProvider is not implemented — see README.md in this directory");
  }

  persistPrivateKey(_signingKeyId: string, _privateKeyHandle: unknown, _tx?: Prisma.TransactionClient): Promise<void> {
    throw new Error("AwsKmsKeyProvider is not implemented — see README.md in this directory");
  }

  sign(_signingKeyId: string, _data: Buffer, _tx?: Prisma.TransactionClient): Promise<Buffer> {
    throw new Error("AwsKmsKeyProvider is not implemented — see README.md in this directory");
  }
}
