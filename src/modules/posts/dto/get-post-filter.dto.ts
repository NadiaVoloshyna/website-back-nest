import { IsOptional } from 'class-validator';
import { PostSortFielsEnum, PostDirectionEnum } from '../post.enum';

export class GetPostFilterDto {
  @IsOptional()
  search: string;

  // @IsOptional()
  // user_id: number;

  // @IsOptional()
  // order_by?: string = PostSortFielsEnum.created_at;

  // @IsOptional()
  // order_type?: string = PostDirectionEnum.DSC; 
}


    
