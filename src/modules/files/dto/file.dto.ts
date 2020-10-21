import { IsNotEmpty } from 'class-validator';

export class FileDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly url: string;

    @IsNotEmpty()
    readonly post_id: number;
}

