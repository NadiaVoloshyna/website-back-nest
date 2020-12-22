import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class PostDto {
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    title: string;

    @IsNotEmpty()
    body: string;
}