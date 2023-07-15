import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule, utilities } from 'nest-winston';
import 'winston-daily-rotate-file';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionFilter } from './filters/all-exception.filte';
declare const module: any;

// async function bootstrap() {
//   // const logger = new Logger();
//   // winston 法
//   const instance = createLogger({
//     transports: [
//       // new winston.transports.Console({
//       //   level: 'info',
//       //   format: winston.format.combine(
//       //     winston.format.timestamp(),
//       //     utilities.format.nestLike(),
//       //   ),
//       // }),
//       // new winston.transports.DailyRotateFile({
//       //   level: 'warn',
//       //   dirname: 'logs',
//       //   filename: 'application-%DATE%.log',
//       //   datePattern: 'YYYY-MM-DD-HH',
//       //   zippedArchive: true,
//       //   maxSize: '20m', // 最大容量
//       //   maxFiles: '14d', // 保存幾天
//       //   format: winston.format.combine(
//       //     winston.format.timestamp(),
//       //     winston.format.simple(),
//       //   ),
//       // }),
//       // new winston.transports.DailyRotateFile({
//       //   level: 'info',
//       //   dirname: 'logs',
//       //   filename: 'info-%DATE%.log',
//       //   datePattern: 'YYYY-MM-DD-HH',
//       //   zippedArchive: true,
//       //   maxSize: '20m', // 最大容量
//       //   maxFiles: '14d', // 保存幾天
//       //   format: winston.format.combine(
//       //     winston.format.timestamp(),
//       //     winston.format.simple(),
//       //   ),
//       // }),
//     ],
//   });
//   // const logger = WinstonModule.createLogger({
//   //   instance,
//   // });
//   const app = await NestFactory.create(AppModule, {
//     // // 關閉整個nestJs日誌
//     // [] 設置等級
//     // logger: false, ['error', 'warn']
//     // logger,
//   });
//   app.setGlobalPrefix('api/v1');
//   app.useGlobalFilters(new HttpExceptionFilter(logger)); // 全局 exception filter
//   // const httpAdapter = app.get(HttpAdapterHost);
//   // app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));
//   await app.listen(3000);
//   // logger.warn('test')
//   // logger.error('test')

//   // // webpack
//   // if (module.hot) {
//   //   module.hot.accept();
//   //   module.hot.dispose(() => app.close());
//   // }
// }
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  // replace the Nest logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1');
  const port = 3000;
  await app.listen(port);
}
bootstrap();
