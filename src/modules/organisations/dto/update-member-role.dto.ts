import { IsEnum } from "class-validator";
import { OrgRole } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: OrgRole })
  @IsEnum(OrgRole)
  role!: OrgRole;
}
