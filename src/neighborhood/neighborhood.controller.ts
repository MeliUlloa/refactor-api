import { Controller, Body, Param, Query, Post, Get, Patch, Delete } from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { NeighborhoodPaginatorDto } from './dto/neighborhood-paginator.dto';

@Controller('neighborhood')
export class NeighborhoodController {
  constructor(private readonly neighborhoodService: NeighborhoodService) {}

  @Post()
  async create(@Body() createNeighborhoodDto: CreateNeighborhoodDto) {
    return this.neighborhoodService.create(createNeighborhoodDto);
  }

  @Get()
  async findAll(@Query() paginatorDto: NeighborhoodPaginatorDto) {
    return this.neighborhoodService.findAll(paginatorDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.neighborhoodService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNeighborhoodDto: CreateNeighborhoodDto) {
    return this.neighborhoodService.update(id, updateNeighborhoodDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.neighborhoodService.remove(id);
  }
}
