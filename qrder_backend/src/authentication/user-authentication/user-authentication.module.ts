import { Module } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { UserAuthenticationController } from './user-authentication.controller';
import { UserModule } from 'src/user/user.module';
import { PaymentModule } from 'src/payment/payment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtUserStrategy } from './strategy/jwt-user.strategy';
import { LocalUserStrategy } from './strategy/local-user.strategy';
import { JwtOptionalUserStrategy } from './strategy/jwt-optional-user.strategy';

@Module({
  imports: [
    UserModule,
    PaymentModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_USER_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get(
            'JWT_USER_ACCESS_TOKEN_EXPIRATION_TIME',
          )}s`,
        },
      }),
    }),
  ],
  providers: [
    UserAuthenticationService,
    JwtUserStrategy,
    JwtOptionalUserStrategy,
    LocalUserStrategy,
  ],
  controllers: [UserAuthenticationController],
})
export class UserAuthenticationModule {}
