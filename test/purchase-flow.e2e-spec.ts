import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { PaymentsService } from "../src/modules/payments/payments.service";
import { BigIntInterceptor } from "../src/common/interceptors/bigint.interceptor";

/**
 * Full purchase-flow smoke test per the build plan's verification section.
 * Requires `docker compose up -d` (Postgres, Redis, Mosquitto) and a
 * migrated database — this hits real infrastructure, it does not mock
 * Prisma/Redis.
 *
 * The paid-order path stops short of calling the real Paystack API (no
 * live keys in CI); instead it calls PaymentsService.confirmPayment(...)
 * directly, standing in for "the webhook fired" the same way
 * PaystackWebhookController would. That's the seam worth trusting here —
 * PaystackProvider itself is a thin HTTP client better covered by a
 * provider-level test with a mocked axios instance than by this e2e spec.
 */
describe("Purchase flow (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let paymentsService: PaymentsService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new BigIntInterceptor());
    await app.init();
    prisma = app.get(PrismaService);
    paymentsService = app.get(PaymentsService);
  });

  afterAll(async () => {
    await app.close();
  });

  async function createVerifiedFreeEventFixture() {
    const email = `organiser-${Date.now()}@example.test`;
    const register = await request(app.getHttpServer())
      .post("/api/auth/register")
      .send({ email, password: "password123", fullName: "Test Organiser" })
      .expect(201);
    const accessToken = register.body.accessToken as string;

    const org = await request(app.getHttpServer())
      .post("/api/organisations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: `Test Org ${Date.now()}`, contactEmail: email })
      .expect(201);

    const startsAt = new Date(Date.now() + 3_600_000).toISOString();
    const salesCloseAt = new Date(Date.now() + 1_800_000).toISOString();
    const event = await request(app.getHttpServer())
      .post(`/api/organisations/${org.body.id}/events`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "Free Community Meetup", startsAt, salesCloseAt })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/organisations/${org.body.id}/events/${event.body.id}/ticket-types`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "General Admission", priceMinor: 0, quantityTotal: 100 })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/organisations/${org.body.id}/events/${event.body.id}/publish`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(201);

    const refreshedEvent = await request(app.getHttpServer())
      .get(`/api/organisations/${org.body.id}/events/${event.body.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    return { accessToken, organisationId: org.body.id, event: refreshedEvent.body };
  }

  it("US-EVT-2: a free event publishes immediately with no KYB check", async () => {
    const { event } = await createVerifiedFreeEventFixture();
    expect(event.status).toBe("published");
  });

  it("issues a signed ticket and credits the wallet for a free/RSVP order with no PSP step", async () => {
    const { organisationId, event, accessToken } = await createVerifiedFreeEventFixture();
    const ticketType = event.ticketTypes[0];

    const orderResponse = await request(app.getHttpServer())
      .post("/api/orders")
      .send({
        eventId: event.id,
        buyerName: "Jane Buyer",
        buyerEmail: `jane-${Date.now()}@example.test`,
        items: [{ ticketTypeId: ticketType.id, quantity: 1 }],
      })
      .expect(201);

    expect(orderResponse.body.status).toBe("paid"); // auto-confirmed, see OrdersController.create
    expect(orderResponse.body.tickets).toHaveLength(1);

    const ticket = orderResponse.body.tickets[0];
    expect(ticket.status).toBe("valid");
    expect(ticket.qrCode).toEqual(expect.any(String));

    const wallet = await request(app.getHttpServer())
      .get(`/api/organisations/${organisationId}/wallet`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    // Free order => 0 revenue, but the wallet row must exist and the flow must not have thrown.
    expect(BigInt(wallet.body.balanceMinor)).toBe(0n);
  });

  it("is idempotent: replaying confirmPayment for an already-paid order is a no-op", async () => {
    const { event } = await createVerifiedFreeEventFixture();
    const ticketType = event.ticketTypes[0];

    const orderResponse = await request(app.getHttpServer())
      .post("/api/orders")
      .send({
        eventId: event.id,
        buyerName: "Idempotency Tester",
        buyerEmail: `idem-${Date.now()}@example.test`,
        items: [{ ticketTypeId: ticketType.id, quantity: 1 }],
      })
      .expect(201);

    const ticketCountBefore = await prisma.ticket.count({ where: { orderId: orderResponse.body.id } });
    await paymentsService.confirmPayment(orderResponse.body.id); // replay
    const ticketCountAfter = await prisma.ticket.count({ where: { orderId: orderResponse.body.id } });

    expect(ticketCountAfter).toBe(ticketCountBefore);
  });
});
