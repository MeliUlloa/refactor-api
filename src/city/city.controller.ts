import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityPaginatorDto } from './dto/city-paginator.dto';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  findAll(@Query() paginatorDto: CityPaginatorDto) {
    return this.cityService.findAll(paginatorDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.update(id, updateCityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cityService.remove(id);
  }
}
