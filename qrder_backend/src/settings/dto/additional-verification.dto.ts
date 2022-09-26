import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class AdditionalVerificationDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('HR')
  phone?: string;
}
