import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(2)
  @Transform(({ value }) => value?.trim())
  @Matches(new RegExp(/^[a-zA-Z\sčćžđšČĆŽĐŠ]*$/))
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @Matches(new RegExp('^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){1,}).{8,}$'))
  readonly password: string;
}
