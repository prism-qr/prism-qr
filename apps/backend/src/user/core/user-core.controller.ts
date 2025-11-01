import { Body, Controller, Get, INestApplication, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserCoreController {
 
}
