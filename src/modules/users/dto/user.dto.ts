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
    name: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        {message: 'password too weak'},
        )
    current_password: string;

    @ValidateIf(o => o.current_password === 'value')
    @IsNotEmpty()
    new_password: string;

    @IsOptional()
    phone: number;

}

