import * as Spec from 'pactum/src/models/Spec';

describe('Auth登入認證 e2e測試', () => {
  let spec;
  beforeEach(() => {
    spec = global.pactum as Spec;
  });

  // 註冊用戶
  it('註冊用戶', () => {
    const user = {
      username: 'toimc1',
      password: '123456',
    };
    return spec
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(201)
      .expectBodyContains(user.username)
      .expectJsonLike({
        id: 1,
        username: user.username,
        roles: [
          {
            id: 2,
            name: '普通用戶',
          },
        ],
      });
  });
  // 重複註冊用戶
  it('重複註冊用戶', async () => {
    const user = {
      username: 'toimc1',
      password: '123456',
    };
    await global.pactum.spec().post('/api/v1/auth/signup').withBody(user);

    return spec
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(403)
      .expectBodyContains('用戶已存在');
  });
  // 註冊用戶傳參數異常
  it('註冊用戶傳參數異常', async () => {
    const user = {
      username: 'toimc1',
      password: '123456',
    };

    return spec
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(400)
      .expectBodyContains('用戶名長度必須在6到20之間');
  });
});
