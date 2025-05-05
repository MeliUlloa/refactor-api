import { IsString, IsOptional } from 'class-validator';

export class UserPaginatorDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  perPage?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortByProperty?: string;
}
