import { PartialType } from '@nestjs/mapped-types';
import { CreateCityDto } from './create-city.dto';

export class UpdateCityDto extends PartialType(CreateCityDto) {}

// Utiliza PartialType para heredar todas las propiedades de CreateCityDto y hacerlas opcionales, facilitando las actualizaciones parciales.