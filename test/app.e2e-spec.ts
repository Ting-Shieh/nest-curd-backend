import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from '../src/setup';
import { AppFactory } from './app.factory';

describe('AppController (e2e)', () => {
  let appFactory: AppFactory;
  let app: INestApplication;
  beforeEach(async () => {
    // const moduleFixture: TestingModule = await Test.createTestingModule({
    //   imports: [AppModule],
    // }).compile();

    // app = moduleFixture.createNestApplication();
    // setupApp(app);
    // await app.init();
    appFactory = await AppFactory.init();
    await appFactory.initDB();
    app = appFactory.instance;
  });

  afterEach(async () => {
    await appFactory.cleanup();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1')
      .expect(200)
      .expect('Hello World!');
  });
});
