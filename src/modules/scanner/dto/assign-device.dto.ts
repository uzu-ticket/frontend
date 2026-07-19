import { IsUUID } from "class-validator";

export class AssignDeviceDto {
  @IsUUID()
  scannerDeviceId!: string;
}
