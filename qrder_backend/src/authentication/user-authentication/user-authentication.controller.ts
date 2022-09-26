import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import MongooseClassSerializerInterceptor from 'src/common/interceptors/mongooseClassSerializer.interceptor';
import { User } from 'src/user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import RequestWithUser from './dto/requestWithUser.interface';
import JwtUserAuthGuard from './guard/jwt-user-auth.guard';
import LocalUserAuthGuard from './guard/local-user-auth.guard';
import { UserAuthenticationService } from './user-authentication.service';

@UseInterceptors(MongooseClassSerializerInterceptor(User))
@Controller('user-authentication')
export class UserAuthenticationController {
  constructor(
    private readonly userAuthenticationService: UserAuthenticationService,
  ) {}

  @UseGuards(JwtUserAuthGuard)
  @Get()
  async getAuthUser(@Req() request: RequestWithUser) {
    return request.user;
  }

  @Post('/register')
  async registerUser(
    @Req() request: Request,
    @Body() registerDto: RegisterDto,
  ) {
    const user = await this.userAuthenticationService.register(registerDto);
    const cookie = await this.userAuthenticationService.getCookieWithJwtToken(
      user.id,
      user.password,
    );
    request.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalUserAuthGuard)
  @Post('/login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie =
      await this.userAuthenticationService.getCookieWithJwtToken(
        user._id,
        user.password,
      );
    const authTypeCookie =
      await this.userAuthenticationService.getAuthTypeCookie();
    request.res.setHeader('Set-Cookie', [accessTokenCookie, authTypeCookie]);
    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtUserAuthGuard)
  @Post('/logout')
  async logOut(@Req() request: RequestWithUser) {
    request.res.clearCookie('AuthType');
    request.res.setHeader(
      'Set-Cookie',
      this.userAuthenticationService.getCookieForLogOut(),
    );
    return { message: 'success' };
  }

  @Get()
  @UseGuards(JwtUserAuthGuard)
  async test(@Req() request: RequestWithUser) {
    console.log(request.user);
    return request.user;
  }
}
