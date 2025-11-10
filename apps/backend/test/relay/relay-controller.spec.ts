import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';

describe('RelayController', () => {
  let bootstrap: Awaited<ReturnType<typeof createTestApp>>;

  beforeAll(async () => {
    bootstrap = await createTestApp();
  });

  beforeEach(async () => {
    await bootstrap.methods.beforeEach();
  });

  afterAll(async () => {
    await bootstrap.methods.afterAll();
  });

  describe('GET /:linkName', () => {
    it('redirects to the destination URL', async () => {
      // given
      const link = await bootstrap.utils.linkUtils.createLink();

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/r/${link.name}`)
        .expect(302);

      // then
      expect(response.headers.location).toBe(link.destination);
    });

    it('returns landing page if link does not exist', async () => {
      const response = await request(bootstrap.app.getHttpServer())
        .get('/r/xyz')
        .expect(302);
      expect(response.headers.location).toBe('https://dev-api.prismqr.com');
    });
  });
});
