import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class LocalUserAuthGuard extends AuthGuard('local_user') {}
