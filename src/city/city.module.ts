import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { PrismaService } from '@/prisma/prisma.service'; 

@Module({
  controllers: [CityController],
  providers: [PrismaService], // Proveemos PrismaService
})
export class CityModule {}
