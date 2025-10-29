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

  describe('GET /links/:id', () => {
    it('gets link by id', async () => {
      // given
      const link = await bootstrap.utils.linkUtils.createLink();

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
      const link = await bootstrap.utils.linkUtils.createLink();

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
