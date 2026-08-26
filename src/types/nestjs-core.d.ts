declare module "@nestjs/core" {
  import { ExecutionContext, Injectable, Type } from "@nestjs/common";

  export const APP_GUARD: symbol;
  export const APP_PIPE: symbol;
  export const APP_INTERCEPTOR: symbol;
  export const APP_FILTER: symbol;

  export class NestFactory {
    static create(module: Type<any>, options?: any): any;
  }

  export class Reflector {
    get<T>(key: string | symbol, context: ExecutionContext[], defaultType?: Type<T>): T;
    getAllAndOverride<T>(key: string | symbol, context: unknown[], defaultType?: Type<T>): T | T[];
    getAllAndMerge<T>(key: string | symbol, context: ExecutionContext[]): T[];
    getExperimental(key: string | symbol, context: ExecutionContext[], defaultType?: any): any;
  }
}
