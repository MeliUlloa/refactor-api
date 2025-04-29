import { IsString, IsOptional, IsBoolean, IsUUID, IsDate, IsNumber } from 'class-validator';

export class CreateCityDto {
  @IsOptional()
  @IsUUID()
  uploadUserID?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  id_visible?: number;

  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;

  @IsBoolean()
  active: boolean;
}
