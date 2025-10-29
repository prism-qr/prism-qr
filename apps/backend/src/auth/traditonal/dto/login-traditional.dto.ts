import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginTraditionalDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
