import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class LocalCompanyAuthGuard extends AuthGuard('local_company') {}
