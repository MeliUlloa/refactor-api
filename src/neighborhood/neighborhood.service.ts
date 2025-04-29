import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { NeighborhoodPaginatorDto } from './dto/neighborhood-paginator.dto';

@Injectable()
export class NeighborhoodService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNeighborhoodDto: CreateNeighborhoodDto) {
    return this.prisma.neighborhood.create({
      data: createNeighborhoodDto,
    });
  }

  async findAll(paginatorDto: NeighborhoodPaginatorDto) {
    return this.prisma.neighborhood.findMany({
      where: {
        deleted: false,
        ...paginatorDto,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.neighborhood.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateNeighborhoodDto: CreateNeighborhoodDto) {
    return this.prisma.neighborhood.update({
      where: { id },
      data: updateNeighborhoodDto,
    });
  }

  async remove(id: string) {
    return this.prisma.neighborhood.update({
      where: { id },
      data: { deleted: true, deletedAt: new Date() },
    });
  }
}
