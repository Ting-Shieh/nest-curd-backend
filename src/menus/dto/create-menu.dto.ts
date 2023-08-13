import { IsNotEmpty, IsString } from "class-validator";

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  order: number;

  @IsString()
  @IsNotEmpty()
  acl: string;
}
