import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * Prisma maps Postgres bigint -> JS BigInt, which JSON.stringify cannot
 * serialize by default. All money/quantity fields are bigint (see
 * common/money.ts), so this runs on every response and turns them into
 * strings rather than throwing at serialization time.
 */
@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => deepSerializeBigInt(data)));
  }
}

function deepSerializeBigInt(value: unknown): unknown {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(deepSerializeBigInt);
  }
  if (value instanceof Date) {
    return value;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = deepSerializeBigInt(val);
    }
    return out;
  }
  return value;
}
