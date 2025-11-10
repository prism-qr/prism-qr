import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';

describe('API Key Management (e2e)', () => {
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

  describe('POST /links/:linkId/api_key', () => {
    it('should create an API key', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_key`)
        .set('Authorization', `Bearer ${setup.token}`)
        .expect(200);

      expect(response.body).toHaveProperty('apiKey');
      expect(response.body.apiKey).toMatch(/^sk_live_[a-f0-9]{64}$/);
    });

    it('should enforce maximum 5 API keys per link', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      for (let i = 0; i < 5; i++) {
        await request(bootstrap.app.getHttpServer())
          .get(`/links/${setup.link.id}/api_key`)
          .set('Authorization', `Bearer ${setup.token}`)
          .expect(200);
      }

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_key`)
        .set('Authorization', `Bearer ${setup.token}`)
        .expect(403);

      expect(response.body.message).toContain('Maximum limit reached');
    });

    it('should reject unauthorized requests', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_key`)
        .expect(403);
    });
  });

  describe('GET /links/:linkId/api_keys', () => {
    it('should list all API keys for a link', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_key`)
        .set('Authorization', `Bearer ${setup.token}`);

      await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_key`)
        .set('Authorization', `Bearer ${setup.token}`);

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_keys`)
        .set('Authorization', `Bearer ${setup.token}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('prefix');
      expect(response.body[0]).toHaveProperty('linkId', setup.link.id);
    });

    it('should return empty array when no API keys exist', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      const response = await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_keys`)
        .set('Authorization', `Bearer ${setup.token}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should reject unauthorized requests', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_keys`)
        .expect(403);
    });
  });

  describe('DELETE /links/:linkId/api_keys/:keyId', () => {
    it('should delete an API key', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_key`)
        .set('Authorization', `Bearer ${setup.token}`);

      const listResponse = await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_keys`)
        .set('Authorization', `Bearer ${setup.token}`);

      const apiKeyId = listResponse.body[0].id;

      const response = await request(bootstrap.app.getHttpServer())
        .delete(`/links/${setup.link.id}/api_keys/${apiKeyId}`)
        .set('Authorization', `Bearer ${setup.token}`)
        .expect(200);

      expect(response.body).toEqual({ success: true });

      const listResponseAfter = await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_keys`)
        .set('Authorization', `Bearer ${setup.token}`);

      expect(listResponseAfter.body).toHaveLength(0);
    });

    it('should allow creating new API key after deletion', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      for (let i = 0; i < 5; i++) {
        await request(bootstrap.app.getHttpServer())
          .get(`/links/${setup.link.id}/api_key`)
          .set('Authorization', `Bearer ${setup.token}`);
      }

      await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_key`)
        .set('Authorization', `Bearer ${setup.token}`)
        .expect(403);

      const listResponse = await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_keys`)
        .set('Authorization', `Bearer ${setup.token}`);

      const apiKeyId = listResponse.body[0].id;

      await request(bootstrap.app.getHttpServer())
        .delete(`/links/${setup.link.id}/api_keys/${apiKeyId}`)
        .set('Authorization', `Bearer ${setup.token}`)
        .expect(200);

      await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_key`)
        .set('Authorization', `Bearer ${setup.token}`)
        .expect(200);
    });

    it('should reject unauthorized requests', async () => {
      const setup = await bootstrap.utils.generalUtils.setupFreeFlow();

      await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_key`)
        .set('Authorization', `Bearer ${setup.token}`);

      const listResponse = await request(bootstrap.app.getHttpServer())
        .get(`/links/${setup.link.id}/api_keys`)
        .set('Authorization', `Bearer ${setup.token}`);

      const apiKeyId = listResponse.body[0].id;

      await request(bootstrap.app.getHttpServer())
        .delete(`/links/${setup.link.id}/api_keys/${apiKeyId}`)
        .expect(403);
    });
  });
});
