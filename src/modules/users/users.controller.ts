import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req } from "@nestjs/common";
import { Request } from "express";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { parseClientDeviceInfo } from "../../common/utils/device-detector.util";
import { UsersService } from "./users.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { SetInterestsDto } from "./dto/set-interests.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@ApiTags("users")
@ApiBearerAuth()
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

  @Patch("me/password")
  @ApiOperation({ summary: "Change account password" })
  @ApiResponse({ status: 200, description: "Password updated successfully" })
  @ApiResponse({ status: 400, description: "Current password incorrect" })
  changePassword(@CurrentUser() user: AuthenticatedUser, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, dto);
  }

  @Put("me/interests")
  setInterests(@CurrentUser() user: AuthenticatedUser, @Body() dto: SetInterestsDto) {
    return this.usersService.setInterests(user.id, dto.categoryIds);
  }

  @Get("me/sessions")
  @ApiOperation({ summary: "Get active user sessions" })
  @ApiResponse({ status: 200, description: "List of active user sessions" })
  getSessions(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    const clientInfo = parseClientDeviceInfo(req);
    return this.usersService.getSessions(user.id, user.sessionId, clientInfo);
  }

  @Delete("me/sessions/:sessionId")
  @ApiOperation({ summary: "Revoke a specific user session" })
  @ApiResponse({ status: 200, description: "Session revoked" })
  revokeSession(@CurrentUser() user: AuthenticatedUser, @Param("sessionId") sessionId: string) {
    return this.usersService.revokeSession(user.id, sessionId);
  }

  @Delete("me/sessions")
  @ApiOperation({ summary: "Revoke all other user sessions" })
  @ApiResponse({ status: 200, description: "All other sessions revoked" })
  revokeAllOtherSessions(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.revokeAllOtherSessions(user.id, user.sessionId);
  }

  @Get("me/login-activity")
  @ApiOperation({ summary: "Get user login activity history" })
  @ApiResponse({ status: 200, description: "List of recent login activities" })
  getLoginActivity(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getLoginActivity(user.id);
  }
}

