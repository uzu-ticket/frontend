import "reflect-metadata";
import helmet from "helmet";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config/app-config.service";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { BigIntInterceptor } from "./common/interceptors/bigint.interceptor";

async function bootstrap() {
  // rawBody:true makes req.rawBody available on every request — needed by the
  // Paystack webhook controller to verify the HMAC-SHA512 signature over the
  // exact bytes received, before body-parser's JSON re-serialization.
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableShutdownHooks(); // SIGTERM/SIGINT -> app.close() -> OnApplicationShutdown (Redis, MQTT, ...)

  const config = app.get(AppConfigService);

  app.use(helmet());
  app.enableCors({ origin: config.corsOrigins, credentials: true });
  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new BigIntInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("UzuTicket API")
    .setDescription("UzuTicket backend — M1-M3 scope")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(config.port);
}

bootstrap();
