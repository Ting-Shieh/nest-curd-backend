// Copyright (c) 2023 Ting<zsting29@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Roles } from 'src/roles/roles.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  password: string;

  roles?: Roles[] | number[];
}