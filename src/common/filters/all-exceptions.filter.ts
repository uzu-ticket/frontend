import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, body } = this.resolve(exception);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...body,
    });
  }

  private resolve(exception: unknown): { status: number; body: Record<string, unknown> } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const body = typeof res === "string" ? { message: res } : (res as Record<string, unknown>);
      return { status: exception.getStatus(), body };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === "P2002") {
        const target = Array.isArray(exception.meta?.target)
          ? exception.meta.target.join(", ")
          : String(exception.meta?.target ?? "field");
        const message = target.includes("slug")
          ? "An organisation with this slug already exists. Choose a different organisation URL."
          : `A resource with this ${target} already exists.`;
        return {
          status: HttpStatus.CONFLICT,
          body: { message },
        };
      }
      if (exception.code === "P2025") {
        return { status: HttpStatus.NOT_FOUND, body: { message: "Resource not found" } };
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: { message: "Internal server error" },
    };
  }
}
