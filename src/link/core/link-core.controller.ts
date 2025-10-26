import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Redirect,
} from '@nestjs/common';
import { LinkReadService } from 'src/link/read/link-read.service';
import { ILink } from './entities/link.interface';
import { CreateLinkDto } from 'src/link/write/dto/create-link.dto';
import { LinkWriteService } from 'src/link/write/link-write.service';
import { UpdateLinkDto } from 'src/link/write/dto/update-link.dto';
import { LinkCoreService } from './link-core.service';
import { Public } from 'src/auth/core/decorators/is-public';

@Controller('')
export class LinkCoreController {
  constructor(
    private readonly linkReadService: LinkReadService,
    private readonly linkWriteService: LinkWriteService,
    private readonly linkCoreService: LinkCoreService,
  ) {}

  @Public()
  @Get(':name')
  @Redirect()
  async redirect(@Param('name') name: string) {
    const targetUrl = await this.linkCoreService.getTargetUrl(name);
    return { url: targetUrl };
  }

  @Get('links/:id')
  async getLinkById(@Param('id') id: string): Promise<ILink> {
    return await this.linkReadService.readById(id);
  }

  @Get('links/name/:name')
  async getLinkByName(@Param('name') name: string): Promise<ILink> {
    return await this.linkReadService.readByName(name);
  }

  @Post('links')
  async createLink(@Body() dto: CreateLinkDto): Promise<ILink> {
    return await this.linkWriteService.createLink(dto);
  }

  @Put('links')
  async updateLink(@Body() dto: UpdateLinkDto): Promise<ILink> {
    return await this.linkWriteService.updateLink(dto);
  }
}
