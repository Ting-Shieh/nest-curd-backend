import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { LogsModule } from './logs/logs.module';

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
  // LOG_ON: Joi.boolean(),
  // LOG_LEVEL: Joi.string(),
});

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: schema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [User, Profile, Logs, Roles],
          synchronize: configService.get(ConfigEnum.DB_SYNC), // 同步本地schema and 數據庫,初始化使用
          // logging: ['error'],
          logging: process.env.NODE_ENV === 'development',
        } as TypeOrmModuleOptions),
    }),
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
    LogsModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
