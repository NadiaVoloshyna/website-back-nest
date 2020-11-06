import { IsOptional } from 'class-validator';

export class GetPostFilterDto {
  @IsOptional()
  search: string;
}