import { IsOptional, IsString, IsUUID } from "class-validator";
import { PaginationQueryDto } from "../../../common/pagination";

export class BrowseEventsDto extends PaginationQueryDto {
  /** Manual city override (PRD §3.4) — falls back to no location ranking if omitted. */
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  q?: string;
}
