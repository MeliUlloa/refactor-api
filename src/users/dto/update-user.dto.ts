import { IsString, IsBoolean, IsOptional, IsEmail, MinLength, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  id_visible?: number;

  @IsOptional()
  @IsString()
  old_password?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsOptional()
  mail?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
  @IsOptional()
  @IsArray()
  updateCityID?: string[]; 

  @IsOptional()
  @IsArray()
  deletedCityID?: string[];
}
