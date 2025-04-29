import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CityPaginatorDto } from './dto/city-paginator.dto';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCityDto: CreateCityDto) {
    return this.prisma.city.create({
      data: createCityDto,
    });
  }

  async findAll(paginatorDto: CityPaginatorDto) {
    const { page = 1, perPage = 10, ...filters } = paginatorDto;

    const cities = await this.prisma.city.findMany({
      where: filters,
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const total = await this.prisma.city.count({
      where: filters,
    });

    return {
      data: cities,
      meta: {
        total,
        page,
        perPage,
        lastPage: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: string) {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) throw new NotFoundException(`City with id ${id} not found`);
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    await this.findOne(id); // Verifica si la ciudad existe
    return this.prisma.city.update({
      where: { id },
      data: updateCityDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Verifica si la ciudad existe
    return this.prisma.city.delete({ where: { id } });
  }
}
