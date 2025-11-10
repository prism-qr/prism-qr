import * as request from 'supertest';
import { createTestApp } from '../utils/bootstrap';

describe('AuthTraditionalController', () => {
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

  describe('POST /auth/traditional/register', () => {
    it('registers a new user and sends confirmation email', async () => {
      const email = 'test@example.com';
      const password = 'Password123!';

      const response = await bootstrap.utils.generalUtils.registerUser(
        email,
        password,
      );

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('check your email');

      const user = await bootstrap.utils.generalUtils.getUserByEmail(email);
      expect(user).toBeDefined();
      expect(user!.emailConfirmed).toBe(false);
      expect(user!.emailConfirmationToken).toBeDefined();

      expect(bootstrap.mocks.mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(bootstrap.mocks.mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: expect.stringContaining('Confirm your email'),
        }),
      );
    });

    it('returns 409 if user already exists', async () => {
      const email = 'duplicate@example.com';
      const password = 'Password123!';

      await bootstrap.utils.generalUtils.registerUser(email, password);

      const response = await bootstrap.utils.generalUtils.registerUser(
        email,
        password,
      );

      expect(response.status).toBe(409);
    });
  });

  describe('POST /auth/traditional/login', () => {
    it('prevents login if email is not confirmed', async () => {
      const email = 'unconfirmed@example.com';
      const password = 'Password123!';

      await bootstrap.utils.generalUtils.registerUser(email, password);

      const loginResponse = await bootstrap.utils.generalUtils.loginUser(
        email,
        password,
      );

      expect(loginResponse.status).toBe(401);
      expect(loginResponse.body.message).toContain('confirm your email');
    });

    it('allows login after email is confirmed', async () => {
      const email = 'confirmed@example.com';
      const password = 'Password123!';

      await bootstrap.utils.generalUtils.registerUser(email, password);

      const user = await bootstrap.utils.generalUtils.getUserByEmail(email);
      const token = user!.emailConfirmationToken!;

      await bootstrap.utils.generalUtils.confirmUserEmail(token);

      const loginResponse = await bootstrap.utils.generalUtils.loginUser(
        email,
        password,
      );

      expect(loginResponse.status).toBe(201);
      expect(loginResponse.body.token).toBeDefined();
      expect(loginResponse.body.isNewUser).toBe(false);
    });
  });

  describe('GET /auth/traditional/confirm-email', () => {
    it('confirms email with valid token', async () => {
      const email = 'confirm@example.com';
      const password = 'Password123!';

      await bootstrap.utils.generalUtils.registerUser(email, password);

      const userBefore =
        await bootstrap.utils.generalUtils.getUserByEmail(email);
      const token = userBefore!.emailConfirmationToken!;

      const response =
        await bootstrap.utils.generalUtils.confirmUserEmail(token);

      expect(response.status).toBe(302);
      expect(response.header.location).toContain('/auth/email-confirmed');
      expect(response.header.location).toContain('token=');
      expect(response.header.location).toContain('success=true');

      const userAfter =
        await bootstrap.utils.generalUtils.getUserByEmail(email);
      expect(userAfter!.emailConfirmed).toBe(true);
      expect(userAfter!.emailConfirmationToken).toBeUndefined();
    });

    it('returns 401 with invalid token', async () => {
      const response =
        await bootstrap.utils.generalUtils.confirmUserEmail('invalid-token');

      expect(response.status).toBe(401);
    });

    it('returns 401 with already used token', async () => {
      const email = 'used-token@example.com';
      const password = 'Password123!';

      await bootstrap.utils.generalUtils.registerUser(email, password);

      const user = await bootstrap.utils.generalUtils.getUserByEmail(email);
      const token = user!.emailConfirmationToken!;

      await bootstrap.utils.generalUtils.confirmUserEmail(token);

      const response =
        await bootstrap.utils.generalUtils.confirmUserEmail(token);

      expect(response.status).toBe(401);
    });
  });
});
