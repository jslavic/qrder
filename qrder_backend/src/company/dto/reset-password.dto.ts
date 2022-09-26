import { Matches } from 'class-validator';

export class ResetPasswordDto {
  @Matches(new RegExp('^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){1,}).{8,}$'))
  newPassword: string;
}
