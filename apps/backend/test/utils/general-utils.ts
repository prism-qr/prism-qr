import { INestApplication } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { LinkEntity } from "src/link/core/entities/link.entity";
import { ILink } from "src/link/core/entities/link.interface";
import { TokenResponse } from "src/shared/responses/token.response";
import { UserEntity } from "src/user/core/entities/user.entity";
import { IUser } from "src/user/core/entities/user.interface";
import * as request from 'supertest';

export class GeneralUtils {
    private readonly userModel: Model<UserEntity>;
    private readonly linkModel: Model<LinkEntity>;
  
    constructor(private readonly app: INestApplication<any>) {
      this.userModel = this.app.get(getModelToken(UserEntity.name));
      this.linkModel = this.app.get(getModelToken(LinkEntity.name));
    }
    public async setupFreeFlow() {
        const token  = await request(this.app.getHttpServer()).post('auth/traditional/register').send({
            email: "test@test.com",
            password: "password"
        }) as unknown as TokenResponse;
        const user = await request(this.app.getHttpServer()).get('auth/traditional/login').set('Authorization', `Bearer ${token}`).send({
            email: "test@test.com",
            password: "password"
        }) as unknown as IUser;

        await this.userModel.updateOne(
            {
              _id: new Types.ObjectId(user.id),
            },
            {
              emailConfirmed: true,
            },
          );

        const link = await request(this.app.getHttpServer()).post('links').set('Authorization', `Bearer ${token}`).send({
            name: 'default',
            destination: 'https://example.com',
        }) as unknown as ILink;

        return {
            token,
            user,
            link,
        };
    }
    }