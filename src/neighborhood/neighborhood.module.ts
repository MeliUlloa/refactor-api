import { Module } from '@nestjs/common';
import { NeighborhoodController } from './neighborhood.controller';
import { NeighborhoodService } from './neighborhood.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [NeighborhoodController],
  providers: [NeighborhoodService, PrismaService],
})
export class NeighborhoodModule {}
