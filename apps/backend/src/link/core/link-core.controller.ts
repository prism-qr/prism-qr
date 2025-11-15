import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  BadRequestException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { LinkReadService } from 'src/link/read/link-read.service';
import { ILink } from './entities/link.interface';
import { CreateLinkDto } from 'src/link/write/dto/create-link.dto';
import { LinkWriteService } from 'src/link/write/link-write.service';
import { UpdateLinkDto } from 'src/link/write/dto/update-link.dto';
import { getUserPlanConfig } from 'src/shared/config/user-plan-configs';
import { CurrentUserId } from 'src/auth/core/decorators/current-user-id.decorator';
import { UserReadService } from 'src/user/read/user-read.service';
import { JwtOrApiKeyAuthGuard } from 'src/auth/core/guards/jwt-or-api-key-auth.guard';
import { SkipJwtAuth } from 'src/auth/core/decorators/skip-jwt-auth.decorator';

@Controller('links')
export class LinkCoreController {
  constructor(
    private readonly linkReadService: LinkReadService,
    private readonly linkWriteService: LinkWriteService,
    private readonly userReadService: UserReadService,
  ) {}

  @Get()
  async getLinksByUserId(
    @CurrentUserId('userId') userId: string,
  ): Promise<ILink[]> {
    console.log(userId);
    return await this.linkReadService.readByUserId(userId);
  }

  @Get(':id')
  async getLinkById(@Param('id') id: string): Promise<ILink> {
    return await this.linkReadService.readById(id);
  }

  @SkipJwtAuth()
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Post()
  async createLink(
    @Body() dto: CreateLinkDto,
    @CurrentUserId() userId: string,
  ): Promise<ILink> {
    const user = await this.userReadService.readByIdOrThrow(userId);

    const MAX_LINKS_PER_USER = getUserPlanConfig(user.tier).links
      .maxNumberOfLinks;

    const currentLinkCount = await this.linkReadService.countByUserId(userId);

    if (currentLinkCount >= MAX_LINKS_PER_USER) {
      throw new BadRequestException(
        'Cannot create more links. Maximum limit reached.',
      );
    }
    return await this.linkWriteService.create(dto, userId);
  }

  @SkipJwtAuth()
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Patch(':linkId')
  async updateLink(
    @Param('linkId') linkId: string,
    @Body() dto: UpdateLinkDto,
  ): Promise<ILink> {
    return await this.linkWriteService.update(linkId, dto.destination);
  }

  @SkipJwtAuth()
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Delete(':linkId')
  async deleteLink(@Param('linkId') linkId: string): Promise<void> {
    return await this.linkWriteService.delete(linkId);
  }

  @Get('name/:name')
  async getLinkByName(@Param('name') name: string): Promise<ILink | null> {
    return await this.linkReadService.readByName(name);
  }
}
