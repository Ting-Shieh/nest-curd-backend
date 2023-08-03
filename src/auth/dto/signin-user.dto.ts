// Copyright (c) 2023 Ting<zsting29@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IsNotEmpty, IsString, Length } from "class-validator";

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    // $value: 當前用户傳入的值
    // $property: 當前屬性名
    // $target: 當前類
    // $constraint1: 最小長度 ...
    message:
      '用戶名長度必須為$constraint1到$constraint2之間，當前傳遞的值$value',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 32)
  password: string;
}
