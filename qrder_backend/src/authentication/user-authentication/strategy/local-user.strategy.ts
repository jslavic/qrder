import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserAuthenticationService } from '../user-authentication.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(
  Strategy,
  'local_user',
) {
  constructor(
    private readonly userAuthenticationService: UserAuthenticationService,
  ) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<User> {
    return this.userAuthenticationService.getAuthenticatedUser(email, password);
  }
}
