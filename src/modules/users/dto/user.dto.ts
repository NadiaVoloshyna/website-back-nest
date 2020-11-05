import { IsNotEmpty, ValidateIf, MinLength, IsEmail, IsOptional, Matches, MaxLength } from 'class-validator';
export class UserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {message: 'password too weak'},
        )
    password: string;

    @IsOptional()
    phone: number;
}

export class UpdateUserDto {
    @IsOptional()
    @MinLength(3)
    name: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    current_password?: string;

    @ValidateIf(UpdateUserDto => UpdateUserDto.new_password !== null && UpdateUserDto.new_password !== '')
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {message: 'password too weak'},
        )   
    new_password?: string;

    @IsOptional()
    phone: number;

}

