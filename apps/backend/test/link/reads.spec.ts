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
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow()
      
      const response = await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}`)
        .set('Authorization', `Bearer ${setup.token}`);

      expect(response.status).toBe(200);
      expect(response.body.destination).toBe(setup.link.destination);
      expect(response.body.name).toBe(setup.link.name);
    });
  });

  describe('GET /links/name/:name', () => {
    it('gets link by name', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow()

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/links/name/${setup.link.name}`)
        .set('Authorization', `Bearer ${setup.token}`);

      expect(response.status).toBe(200);
      expect(response.body.destination).toBe(setup.link.destination);
      expect(response.body.name).toBe(setup.link.name);
    });
  });
});
