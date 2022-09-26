import { IsDefined, IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2)
  @Matches(new RegExp(/^[a-zA-Z\sčćžđšČĆŽĐŠ]*$/))
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsDefined()
  readonly password: string;

  @IsDefined()
  readonly customerId: string;
}
