// Copyright (c) 2023 Ting<zsting29@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ConfigEnum } from './src/enum/config.enum';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// 通過環境變量讀取不同的.env文件
export function getEnv(env: string) {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}

// 通过dotENV来解析不同的配置
export function buildConnectionOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  // configService
  const config = { ...defaultConfig, ...envConfig };
  //
  const logFlag = config['LOG_ON'] === 'true';
  const entitiesDir =
    process.env.NODE_ENV === 'test'
      ? [__dirname + '/**/*.entity.ts']
      : [__dirname + '/**/*.entity{.js,.ts}'];
  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    entities: entitiesDir,
    synchronize: true, // ConfigEnum.DB_SYNC, // 同步本地schema and 數據庫,初始化使用
    // logging: ['error'],
    // logging: process.env.NODE_ENV === 'development',
    logging: false,
  } as TypeOrmModuleOptions;
}

export const connectionParams = buildConnectionOptions();

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
