import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module'; // Agregamos la importación del PrismaModule para que el servicio tenga acceso a la base de datos
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

// agrupa y conecta el controlador con el servicio, e inyecta el PrismaService gracias al PrismaModule.