import { AppFactory } from './app.factory';
import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';

let appFactory: AppFactory;
let app: INestApplication;
global.beforeEach(async () => {
  appFactory = await AppFactory.init();
  await appFactory.initDB();
  app = appFactory.instance;
});

global.afterEach(async () => {
  await appFactory.cleanup();
});
