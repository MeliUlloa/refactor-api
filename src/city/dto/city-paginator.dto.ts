import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';

export class CityPaginatorDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsUUID('all', { each: true })
  cityIDs?: string[];

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortByProperty?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  perPage?: number;
}
