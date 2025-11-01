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
        const registerResponse = await request(this.app.getHttpServer())
            .post('/auth/traditional/register')
            .send({
                email: "test@test.com",
                password: "password"
            });
        
        const { token } = registerResponse.body as TokenResponse;

        const userEntity = await this.userModel.findOne({ email: "test@test.com" }).lean();

        if (!userEntity) {
            throw new Error('User not found after registration');
        }

        await this.userModel.updateOne(
            {
              _id: userEntity._id,
            },
            {
              emailConfirmed: true,
            },
          );

        const linkResponse = await request(this.app.getHttpServer())
            .post('/links')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'default',
                destination: 'https://example.com',
            });

        const link = linkResponse.body as ILink;

        const user: IUser = {
            id: userEntity._id.toString(),
            email: userEntity.email,
            authMethod: userEntity.authMethod,
            passwordHash: userEntity.passwordHash,
            accountClaimStatus: userEntity.accountClaimStatus,
            tier: userEntity.tier,
            stripeCustomerId: userEntity.stripeCustomerId,
            paymentsMetadata: userEntity.paymentsMetadata,
        };

        return {
            token,
            user,
            link,
        };
    }
    }