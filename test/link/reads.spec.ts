import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';

describe('LinkCoreController (reads)', () => {
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
      const link = await bootstrap.utils.linkUtils.createLink({
        name: 'test',
        destination: 'https://example.com',
      });

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

  describe('GET /links/:id', () => {
    it('gets link by id', async () => {
      // given
      const link = await bootstrap.utils.linkUtils.createLink({
        name: 'test',
        destination: 'https://example.com',
      });

      // when
      const response = await request(bootstrap.app.getHttpServer()).get(
        `/links/${link.id}`,
      );

      // then
      expect(response.body.destination).toBe(link.destination);
      expect(response.body.name).toBe(link.name);
    });
  });

  describe('GET /links/name/:name', () => {
    it('gets link by name', async () => {
      // given
      const link = await bootstrap.utils.linkUtils.createLink({
        name: 'test',
        destination: 'https://example.com',
      });

      // when
      // Test redirection
      const response = await request(bootstrap.app.getHttpServer()).get(
        `/links/name/${link.name}`,
      );

      // then
      expect(response.body.destination).toBe(link.destination);
      expect(response.body.name).toBe(link.name);
    });
  });
});
