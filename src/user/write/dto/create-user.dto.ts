import { AuthMethod } from '../../core/enum/auth-method.enum';

export class CreateUserParams {
  email: string;
  passwordHash?: string;
  authMethod: AuthMethod;
}
