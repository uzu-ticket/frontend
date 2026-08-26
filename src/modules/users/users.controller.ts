import { Body, Controller, Get, Patch, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { SetInterestsDto } from "./dto/set-interests.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("search")
  searchUsers(@Query("q") query: string) {
    return this.usersService.searchUsers(query);
  }

  @Get("me")
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getProfile(user.id);
  }

  @Patch("me")
  updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Put("me/interests")
  setInterests(@CurrentUser() user: AuthenticatedUser, @Body() dto: SetInterestsDto) {
    return this.usersService.setInterests(user.id, dto.categoryIds);
  }
}
