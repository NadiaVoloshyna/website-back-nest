import { IsNotEmpty, MinLength } from 'class-validator';

export class PostDto {
    @IsNotEmpty()
    @MinLength(4)
    title: string;

    @IsNotEmpty()
    body: string;
}