import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { ClaimPaginatorDto } from './dto/claim-paginator.dto';

@Injectable()
export class ClaimService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear un nuevo reclamo
  async createClaim(createClaimDto: CreateClaimDto, uploadUserID: string) {
    return this.prisma.claim.create({
      data: {
        ...createClaimDto,
        uploadUserID,
      },
    });
  }

  // Obtener reclamos con paginación y filtros
  async getClaims(paginator: ClaimPaginatorDto) {
    const { page, perPage, neighborhood, clientName, ...rest } = paginator;
  
    const where: any = {
      ...rest,
    };
  
    if (clientName) {
      where.clientName = {
        contains: clientName,
        mode: 'insensitive',
      };
    }
  
    if (neighborhood) {
      where.neighborhood = {
        name: {
          contains: neighborhood,
          mode: 'insensitive',
        },
      };
    }
  
    return this.prisma.claim.findMany({
      where,
      skip: page && perPage ? (page - 1) * perPage : undefined,
      take: perPage,
    });
  }
  

  // Obtener un solo reclamo por ID
  async getClaimById(id: string) {
    return this.prisma.claim.findFirst({ where: { id } });
  }

  // Actualizar un reclamo
  async updateClaim(id: string, updateData: any) {
    return this.prisma.claim.update({
      where: { id },
      data: updateData,
    });
  }

  // Eliminar un reclamo (soft delete)
  async deleteClaim(id: string) {
    return this.updateClaim(id, { deleted: true, deletedAt: new Date() });
  }

  // Obtener reportes por ciudad (estadísticas)
  async getReportByCity(paginator: ClaimPaginatorDto) {
    const { from, to, cityIDs } = paginator;
    const f = new Date(from.setHours(0, 0, 0, 0));
    const t = new Date(to.setHours(23, 59, 59, 999));

    const result = await this.prisma.claim.findMany({
      where: {
        active: true,
        deleted: false,
        createdAt: { gte: f, lte: t },
        neighborhood: { city: { id: { in: cityIDs } } },
      },
      include: {
        neighborhood: { include: { city: true } },
      },
    });

    const a: {
      id: string;
      cities: { id: string; city: string; value: number }[]; 
    }[] = [];

    result.forEach((claim) => {
      let n = a.findIndex((i) => i.id == claim.neighborhood.id);
      if (n < 0) {
        let item = {
          id: claim.neighborhood.id,
          cities: [],
        };
        a.push(item);
        n = a.length - 1;
      }
      let c = a[n].cities.findIndex((i) => i.id == claim.neighborhood.city.id);
      if (c < 0) {
        const item = {
          id: claim.neighborhood.city.id,
          city: claim.neighborhood.city.name,
          value: 0,
        };
        a[n].cities.push(item);
        c = a[n].cities.length - 1;
      }
      a[n].cities[c].value += 1;
    });

    return a;
  }
}
