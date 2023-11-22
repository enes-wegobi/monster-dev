import {
  IsString,
  IsEmail,
  IsMobilePhone,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

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
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  channels?: string[];
}
