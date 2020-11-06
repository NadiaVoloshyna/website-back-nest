import { IsOptional } from 'class-validator';

export class GetUserFilterDto {
  @IsOptional()
  search: string;
}