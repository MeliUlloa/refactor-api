import { IsString, IsBoolean, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  id_visible?: number;

  @IsString()
  @MinLength(5)
  username: string;

  @IsEmail()
  mail: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name?: string;

  @IsString()
  last_name?: string;

  @IsBoolean()
  active?: boolean = true;

  @IsOptional()
  @IsString({ each: true })
  updateCityID?: string[];

  @IsOptional()
  @IsString()
  id_user?: string;
}
