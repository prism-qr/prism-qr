import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ILink } from 'src/link/core/entities/link.interface';
import { TokenResponse } from 'src/shared/responses/token.response';
import { UserEntity } from 'src/user/core/entities/user.entity';
import { IUser } from 'src/user/core/entities/user.interface';
import * as request from 'supertest';

export class GeneralUtils {
  private readonly userModel: Model<UserEntity>;

  constructor(private readonly app: INestApplication<any>) {
    this.userModel = this.app.get(getModelToken(UserEntity.name));
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

  public async setupFreeUser() {
    const registerResponse = await request(this.app.getHttpServer())
      .post('/auth/traditional/register')
      .send({
        email: 'test@test.com',
        password: 'password',
      });
    const { token } = registerResponse.body as TokenResponse;

    const loginResponse = await request(this.app.getHttpServer())
      .post('/auth/traditional/login')
      .send({
        email: 'test@test.com',
        password: 'password',
      });
    const user = loginResponse.body as IUser;

    await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(user.id),
      },
      {
        emailConfirmed: true,
      },
    );

    return {
      token,
      user,
    };
  }
}
