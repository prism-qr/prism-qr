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
      // when
      const linkPayload: CreateLinkDto = {
        name: 'testlink',
        destination: 'https://example.com',
      };

      const response = await request(bootstrap.app.getHttpServer())
        .post('/links')
        .send(linkPayload)
        .expect(201);

      // then
      expect(response.body).toMatchObject({
        id: expect.any(String),
        destination: linkPayload.destination,
        name: linkPayload.name,
      });
    });
  });

  describe('PUT /links', () => {
    it('updates link destination', async () => {
      // given
      const link = await bootstrap.utils.linkUtils.createLink({
        name: 'test',
        destination: 'https://example.com',
      });
      const updateDto: UpdateLinkDto = {
        id: link.id,
        destination: 'https://example2.com',
      };

      // when
      const response = await request(bootstrap.app.getHttpServer())
        .put(`/links`)
        .send(updateDto);

      // then
      expect(response.body.destination).toBe(updateDto.destination);
    });
  });
});
