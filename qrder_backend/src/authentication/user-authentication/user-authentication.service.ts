import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PaymentService } from 'src/payment/payment.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UserAuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingCustomers = await this.paymentService.findCustomersByEmail(
      registerDto.email,
    );
    if (existingCustomers.length !== 0)
      throw new ConflictException('Customer with that email already exists');
    const customer = await this.paymentService.createCustomer(
      registerDto.email,
    );
    try {
      const hashedPassword = await hash(registerDto.password, 10);
      const registeredUser = await this.userService.createUser({
        ...registerDto,
        password: hashedPassword,
        customerId: customer.id,
      });
      return registeredUser;
    } catch (error) {
      this.paymentService.deleteCustomerById(customer.id);
      throw new ConflictException('User with that mail already exists');
    }
  }

  async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.userService.findByEmail(email);
      await this.verifyPassword(hashedPassword, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException('Invalid credentials provided');
    }
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException('Invalid credentials provided');
    }
  }

  async getCookieWithJwtToken(userId: string, hashedPassword: string) {
    const payload = { sub: { userId, hashedPassword } };
    const token = await this.jwtService.signAsync(payload);
    return `Authorization=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_USER_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  async getAuthTypeCookie() {
    return `AuthType=User; Path=/; Max-Age=${this.configService.get(
      'JWT_COMPANY_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  getCookieForLogOut() {
    return `Authorization=; HttpOnly; Path=/; Max-Age=0`;
  }
}
