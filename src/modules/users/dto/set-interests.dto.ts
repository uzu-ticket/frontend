import { ArrayUnique, IsArray, IsUUID } from "class-validator";

export class SetInterestsDto {
  @IsArray()
  @ArrayUnique()
  @IsUUID("all", { each: true })
  categoryIds!: string[];
}
