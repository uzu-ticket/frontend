import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { OrdersService } from "./orders.service";
import { PaymentsService } from "../payments/payments.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CancelOrderDto } from "./dto/cancel-order.dto";

@ApiTags("orders")
@Controller("orders")
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  /**
   * Guest checkout (PRD §3.3): no auth required to create an order. A
   * free/RSVP order (all selected ticket types priced 0) has no PSP step —
   * confirm and issue tickets immediately rather than sending the buyer
   * through a $0 checkout.
   */
  @Public()
  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const order = await this.ordersService.createOrder(dto);
    if (order.totalMinor === 0n) {
      await this.paymentsService.confirmFreeOrder(order.id);
      return this.ordersService.findOne(order.id);
    }
    return order;
  }

  // NOTE: static routes must be registered before ":orderId" or Nest/Express
  // will treat "mine" as an :orderId value.
  @Get("mine")
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findMine(user.id);
  }

  @Get("mine/tickets")
  findMyTickets(@CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findMyTickets(user.id);
  }

  /**
   * Lists all orders across every event in an organisation. The
   * organisation context for the dashboard — any accepted member can
   * read the list; write operations (cancel, refund) enforce stricter
   * permission checks in the service layer.
   */
  @Get("organisation/:organisationId")
  listForOrganisation(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.ordersService.listForOrganisation(organisationId, user.id);
  }

  @Post(":orderId/cancel")
  cancelOrder(@CurrentUser() user: AuthenticatedUser, @Param("orderId") orderId: string, @Body() dto: CancelOrderDto) {
    return this.ordersService.cancelOrder(orderId, user.id, dto.reason);
  }

  /**
   * The order id is a UUIDv7 (unguessable) and doubles as the confirmation
   * page's capability token, so guest buyers can view their own order
   * without an account — same pattern as most hosted checkout flows.
   */
  @Public()
  @Get(":orderId")
  findOne(@Param("orderId") orderId: string) {
    return this.ordersService.findOne(orderId);
  }
}
