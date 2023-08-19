import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from 'src/app.module';
import { setupApp } from 'src/setup';
import datasource from '../ormconfig';
import { DataSource } from 'typeorm';

// 方法一：const app = new AppFactory().init() init -> return app实例
// 方法二：OOP get instance() -> app ,private app, AppFactory constructor的部分进行初始化
//  const appFactory = AppFactory.init() -> const app = appFactory.instance
export class AppFactory {
  connection: DataSource;
  constructor(private app: INestApplication) {}

  get instance() {
    return this.app;
  }

  // 初始化App實例
  static async init() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    setupApp(app);
    const port = 3000;
    await app.listen(port);
    await app.init();
    return new AppFactory(app);
  }
  // 初始化db資料庫
  async initDB() {
    if (!datasource.isInitialized) {
      await datasource.initialize();
    }
    this.connection = datasource;
    // 測試的基礎的字典資料寫入到資料庫中
    // Method1: this.connection.runMigrations()
    // Method2: 寫入SQL語句 (V)
    const queryRunner = this.connection.createQueryRunner();

    const sql =
      readFileSync(join(__dirname, '../src/migrations/init.sql'))
        .toString()
        .replace(/\r?\n|\r/g, '')
        ?.split(';') || [];

    for (let i = 0; i < sql.length; i++) {
      await queryRunner.query(sql[i]);
    }
  }
  // 清除資料庫資料 -> 避免測試資料污染
  async cleanup() {
    const entities = this.connection.entityMetadatas;
    for (const entity of entities) {
      const repository = this.connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    }
  }
  // 斷開與資料庫的連接 -> 避免後續資料庫連接連接過多而無法連接
  async destory() {
    await this.connection?.destroy();
  }
}
