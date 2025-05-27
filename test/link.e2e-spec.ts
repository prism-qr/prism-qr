import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Link E2E', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new link', async () => {
    const linkPayload = {
      name: 'testlink',
      destination: 'https://example.com',
    };

    const response = await request(httpServer)
      .post('/links')
      .send(linkPayload);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body.name).toBe(linkPayload.name);
    expect(response.body.destination).toBe(linkPayload.destination);
  });

  it('should redirect to the destination URL', async () => {
    const linkPayload = {
      name: 'redirect-test',
      destination: 'https://destination-example.com',
    };

    // Create the link first
    const createResponse = await request(httpServer)
      .post('/links')
      .send(linkPayload);
    expect(createResponse.status).toBe(201); // Ensure link creation was successful

    // Test redirection
    const redirectResponse = await request(httpServer).get(
      `/${linkPayload.name}`,
    );

    expect(redirectResponse.status).toBe(302);
    expect(redirectResponse.headers.location).toBe(linkPayload.destination);
  });

  it('should retrieve a link by ID', async () => {
    const linkPayload = {
      name: 'get-by-id-test',
      destination: 'https://id-example.com',
    };

    // Create the link first
    const createResponse = await request(httpServer)
      .post('/links')
      .send(linkPayload);
    expect(createResponse.status).toBe(201); // Ensure link creation was successful
    const createdLink = createResponse.body;

    // Retrieve the link by ID
    const getResponse = await request(httpServer).get(
      `/links/${createdLink.id}`,
    );

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toBeInstanceOf(Object);
    expect(getResponse.body.id).toBe(createdLink.id);
    expect(getResponse.body.name).toBe(linkPayload.name);
    expect(getResponse.body.destination).toBe(linkPayload.destination);
  });

  it('should retrieve a link by name', async () => {
    const linkPayload = {
      name: 'get-by-name-test',
      destination: 'https://name-example.com',
    };

    // Create the link first
    const createResponse = await request(httpServer)
      .post('/links')
      .send(linkPayload);
    expect(createResponse.status).toBe(201); // Ensure link creation was successful
    const createdLink = createResponse.body;

    // Retrieve the link by name
    const getResponse = await request(httpServer).get(
      `/links/name/${linkPayload.name}`,
    );

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toBeInstanceOf(Object);
    expect(getResponse.body.id).toBe(createdLink.id);
    expect(getResponse.body.name).toBe(linkPayload.name);
    expect(getResponse.body.destination).toBe(linkPayload.destination);
  });

  it('should update a link destination', async () => {
    const initialLinkPayload = {
      name: 'update-test',
      destination: 'https://initial-example.com',
    };

    // 1. Create the link
    const createResponse = await request(httpServer)
      .post('/links')
      .send(initialLinkPayload);
    expect(createResponse.status).toBe(201);
    const createdLink = createResponse.body;

    // 2. Prepare update payload
    const updatePayload = {
      id: createdLink.id,
      destination: 'https://updated-example.com',
    };

    // 3. Send PUT request to update the link
    const updateResponse = await request(httpServer)
      .put(`/links/${createdLink.name}`) // Using original name in path
      .send(updatePayload);
    expect(updateResponse.status).toBe(200); // Controller returns void, so 200 OK

    // 4. Verify the update
    const getResponse = await request(httpServer).get(
      `/links/name/${createdLink.name}`, // Fetch by original name
    );
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.id).toBe(createdLink.id);
    expect(getResponse.body.name).toBe(initialLinkPayload.name);
    expect(getResponse.body.destination).toBe(updatePayload.destination);
  });

  it('should return 404 for redirection if link name does not exist', async () => {
    const response = await request(httpServer).get('/nonexistentlink12345');
    expect(response.status).toBe(404);
  });

  it('should return 404 for getLinkById if link ID does not exist', async () => {
    const response = await request(httpServer).get(
      '/links/00000000-0000-0000-0000-000000000000',
    );
    expect(response.status).toBe(404);
  });

  it('should return 404 for getLinkByName if link name does not exist', async () => {
    const response = await request(httpServer).get(
      '/links/name/nonexistentlink12345',
    );
    expect(response.status).toBe(404);
  });

  it('should return 404 for updateLink if link name does not exist', async () => {
    const response = await request(httpServer)
      .put('/links/nonexistentlink12345')
      .send({ id: 'anyid', destination: 'https://updated.com' });
    expect(response.status).toBe(404);
  });
});
