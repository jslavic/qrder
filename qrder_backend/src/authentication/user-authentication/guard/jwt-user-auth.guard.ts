import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtUserAuthGuard extends AuthGuard('jwt_user') {}
