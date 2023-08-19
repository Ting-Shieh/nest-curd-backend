import { AppFactory } from './app.factory';
import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';

let appFactory: AppFactory;
let app: INestApplication;
global.beforeEach(async () => {
  appFactory = await AppFactory.init();
  // 防止端口被佔用
  await appFactory?.destory();
  await appFactory.initDB();
  app = appFactory.instance;
  global.app = app; // 全局掛載
});

global.afterEach(async () => {
  await appFactory?.cleanup();
  // 關閉進程
  await app?.close();
});
