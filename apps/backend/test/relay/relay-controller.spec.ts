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
        .get(`/${link.name}`)
        .expect(302);

      // then
      expect(response.headers.location).toBe(link.destination);
    });

    it('returns 404 if link does not exist', async () => {
      await request(bootstrap.app.getHttpServer()).get('/xyz').expect(404);
    });
  });
});
