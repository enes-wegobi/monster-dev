import {
  IsString,
  IsEmail,
  IsMobilePhone,
  IsArray,
  ArrayMinSize,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name?: string;
  @IsString()
  @IsNotEmpty()
  birthdate?: string;
  @IsString()
  @IsNotEmpty()
  gender?: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsMobilePhone()
  @IsNotEmpty()
  phoneNumber?: string;
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  channels?: string[];
}
