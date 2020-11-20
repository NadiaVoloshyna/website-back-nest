import { IsOptional } from 'class-validator';
export class GetPostFilterDto {
  @IsOptional()
  title: string;

  @IsOptional()
  user_id?: number;
}


    
