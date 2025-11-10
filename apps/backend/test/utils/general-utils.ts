import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ILink } from 'src/link/core/entities/link.interface';
import { TokenResponse } from 'src/shared/responses/token.response';
import { UserEntity } from 'src/user/core/entities/user.entity';
import * as request from 'supertest';

export class GeneralUtils {
  private readonly userModel: Model<UserEntity>;

  constructor(private readonly app: INestApplication<any>) {
    this.userModel = this.app.get(getModelToken(UserEntity.name));
  }

  public async registerUser(email: string, password: string) {
    const response = await request(this.app.getHttpServer())
      .post('/auth/traditional/register')
      .send({ email, password });

    return response;
  }

  public async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  public async confirmUserEmail(token: string) {
    const response = await request(this.app.getHttpServer()).get(
      `/auth/traditional/confirm-email?token=${token}`,
    );

    return response;
  }

  public async loginUser(email: string, password: string) {
    const response = await request(this.app.getHttpServer())
      .post('/auth/traditional/login')
      .send({ email, password });

    return response;
  }

  public async setupFreeFlow() {
    const { token, user } = await this.setupFreeUser();

    const linkResponse = await request(this.app.getHttpServer())
      .post('/links')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'default',
        destination: 'https://example.com',
      });
    const link = linkResponse.body as ILink;

    return {
      token,
      user,
      link,
    };
  }

  public async setupFreeUser(emailConfirmed: boolean = true) {
    await request(this.app.getHttpServer())
      .post('/auth/traditional/register')
      .send({
        email: 'test@test.com',
        password: 'password',
      });

    const user = await this.userModel.findOneAndUpdate(
      { email: 'test@test.com' },
      { emailConfirmed },
      { new: true },
    );

    const loginResponse = await request(this.app.getHttpServer())
      .post('/auth/traditional/login')
      .send({
        email: 'test@test.com',
        password: 'password',
      });

    const { token } = loginResponse.body as TokenResponse;

    return {
      token,
      user,
    };
  }
}
