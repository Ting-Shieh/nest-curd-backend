import * as pactum from 'pactum';

describe('AppController (e2e)', () => {
  let spec;
  beforeEach(() => {
    // console.log('app', global.app);
    pactum.request.setBaseUrl('http://localhost:3000');
    // spec = global.pactum as Spec;
  });
  it('/ (GET)', () => {
    return pactum
      .spec('/api/v1/auth')
      .expectStatus(200)
      .expectBodyContains('Hello World!');
  });
});
