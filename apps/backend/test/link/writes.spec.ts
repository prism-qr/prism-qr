import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';
import { UpdateLinkDto } from 'src/link/write/dto/update-link.dto';
import { CreateLinkDto } from 'src/link/write/dto/create-link.dto';

describe('LinkCoreController (writes)', () => {
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

  describe('POST /links', () => {
    it('should create a new link', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeUser();

      const data: CreateLinkDto = {
        name: 'test',
        destination: 'https://example.com',
      };

      const response = await request(bootstrap.app.getHttpServer())
        .post('/links')
        .set('Authorization', `Bearer ${setup.token}`)
        .send(data)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        destination: data.destination,
        name: data.name,
      });
    });
  });

  describe('PATCH /links', () => {
    it('updates link destination', async () => {
      // given
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      // when
      const updateDto: UpdateLinkDto = {
        destination: 'https://example2.com',
      };

      const response = await request(bootstrap.app.getHttpServer())
        .patch(`/links/${setup.link.id}`)
        .set('Authorization', `Bearer ${setup.token}`)
        .send(updateDto);

      // then
      expect(response.body.destination).toBe(updateDto.destination);
    });
  });

  describe('DELETE /links/:linkId', () => {
    it('deletes link', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/links/${setup.link.id}`)
        .set('Authorization', `Bearer ${setup.token}`);

      expect(response.status).toBe(200);
    });
  });
});
