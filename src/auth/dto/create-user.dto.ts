import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";




export class CreateUserDto {

  @ApiProperty({
    type: String,
    description: `the email of the user`,
    nullable: false,
  })
  @IsString()
  @IsEmail()
  email: string;


  @ApiProperty({
    type: String,
    description: `user's password. this need to be secure`,
    nullable: false,
    format: 'password'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

  @ApiProperty({
    type: String,
    description: `Name and surname of the user`,
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  fullName: string;

}