// Copyright (c) 2023 Ting<zsting29@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface getUserDto {
  page: number;
  limit?: number;
  username?: string;
  role?: number;
  gender?: string;
}
