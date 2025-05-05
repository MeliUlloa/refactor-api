import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CityService } from './city.service';

@Module({
  controllers: [CityController],
  providers: [CityService], // Proveemos PrismaService
  imports: [PrismaModule], // necesario si usa PrismaService
})
export class CityModule {}
