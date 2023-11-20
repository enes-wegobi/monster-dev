import { IsString, IsEmail, IsMobilePhone } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name?: string;
  @IsString()
  birthdate?: string;
  @IsString()
  gender?: string;
  @IsEmail()
  email: string;
  @IsMobilePhone()
  phoneNumber?: string;
  @IsString()
  photo?: string;
}
