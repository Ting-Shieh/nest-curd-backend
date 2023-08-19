import { INestApplication, ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getServerConfig } from 'ormconfig';

export const setupApp = (app: INestApplication) => {
  // mock app.module.ts and main.ts
  const config = getServerConfig();
  const flag: boolean = config['LOG_ON'] === 'true';
  flag && app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1');
  // 全局攔截器
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // 去除在類上不存在的字段
    }),
  );
  // helmet头部安全
  app.use(helmet());

  // rateLimit限流
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 300, // limit each IP to 100 requests per windowMs
    }),
  );
};
