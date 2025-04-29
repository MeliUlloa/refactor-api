import { IsOptional, IsString, IsBoolean, IsArray, IsDate, IsUUID } from 'class-validator';

export class CreateNeighborhoodDto {
  @IsOptional()
  @IsString()
  id_visible?: number;

  @IsOptional()
  @IsString()
  uploadUserID?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID()
  zoneID?: string;

  @IsOptional()
  @IsUUID()
  cityID?: string;

  @IsOptional()
  @IsArray()
  coordinates?: string[];

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
