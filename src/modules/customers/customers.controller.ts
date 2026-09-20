import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { CustomersService } from "./customers.service";

@ApiTags("customers")
@Controller("organisations/:organisationId/customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get("stats")
  getStats(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.customersService.getStats(organisationId, user.id);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.customersService.list(organisationId, user.id);
  }

  @Get(":customerId")
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("customerId") customerId: string,
  ) {
    return this.customersService.findOne(organisationId, customerId, user.id);
  }

  @Post(":customerId/activate")
  activate(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("customerId") customerId: string,
  ) {
    return this.customersService.setStatus(organisationId, customerId, user.id, "active");
  }

  @Post(":customerId/deactivate")
  deactivate(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("customerId") customerId: string,
  ) {
    return this.customersService.setStatus(organisationId, customerId, user.id, "suspended");
  }
}
