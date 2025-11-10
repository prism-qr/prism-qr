import { IsString } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  name: string;

  @IsString()
  destination: string;
}
