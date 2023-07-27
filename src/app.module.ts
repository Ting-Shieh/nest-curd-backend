import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
// import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';
import { connectionParams } from '../ormconfig';

const envFilePath = [`.env.${process.env.NODE_ENV || `development`}`, '.env'];

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DB_PORT: Joi.number().default(3306),
  DB_HOST: Joi.alternatives().try(Joi.string().ip(), Joi.string().domain()),
  DB_TYPE: Joi.string().valid('mysql', 'postgres'),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),
  LOG_ON: Joi.boolean(),
  LOG_LEVEL: Joi.string(),
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      // load: [() => dotenv.config({ path: '.env' })],
      validationSchema: schema,
    }),
    TypeOrmModule.forRoot(connectionParams),
    // looger 'pino'
    // LoggerModule.forRoot({
    //   // npm i pino-pretty 中間件
    //   // npm i pino-roll 中間件
    //   pinoHttp: {
    //     transport: {
    //       targets: [
    //         process.env.NODE_ENV === 'development'
    //           ? {
    //               level: 'info',
    //               target: 'pino-pretty',
    //               options: {
    //                 colorize: true,
    //               },
    //             }
    //           : {
    //               level: 'info',
    //               target: 'pino-roll',
    //               options: {
    //                 file: join('logs', 'logs.txt'), // 指定文件
    //                 frequency: 'daily', // 打印週期
    //                 size: '10m',
    //                 mkdir: true,
    //               },
    //             },
    //       ],
    //     },
    //     // process.env.NODE_ENV === 'development'
    //     //   ? {
    //     //       target: 'pino-pretty',
    //     //       options: {
    //     //         colorize: true,
    //     //       },
    //     //     }
    //     //   : {
    //     //       target: 'pino-roll',
    //     //       options: {
    //     //         file: 'logs.txt', // 指定文件
    //     //         frequency: 'daily', // 打印週期
    //     //         mkdir: true,
    //     //       },
    //     //     },
    //   },
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'example',
    //   database: 'testdb',
    //   entities: [],
    //   synchronize: true, // 同步本地schema and 數據庫,初始化使用
    //   logging: ['error'],
    // }),
    UserModule,
    RolesModule,
    LogsModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
