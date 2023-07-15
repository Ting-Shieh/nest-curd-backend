// Copyright (c) 2023 Ting<zsting29@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { User } from 'src/user/user.entity';
import { ConfigEnum } from './src/enum/config.enum';
import { Profile } from 'src/user/profile.entity';
import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export default {
  type: 'mysql', // ConfigEnum.DB_TYPE,
  host: '', // ConfigEnum.DB_HOST,
  port: 3306, // ConfigEnum.DB_PORT,
  username: 'root', // ConfigEnum.DB_USERNAME,
  password: 'example', // ConfigEnum.DB_PASSWORD,
  database: 'testdb', // ConfigEnum.DB_DATABASE,
  entities: [User, Profile, Logs, Roles],
  synchronize: true, // ConfigEnum.DB_SYNC, // 同步本地schema and 數據庫,初始化使用
  // logging: ['error'],
  // logging: process.env.NODE_ENV === 'development',
  logging: false,
} as TypeOrmModuleOptions;
