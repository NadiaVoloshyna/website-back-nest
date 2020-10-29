import { IsNotEmpty } from 'class-validator';

export class FileDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    url: string;
}

