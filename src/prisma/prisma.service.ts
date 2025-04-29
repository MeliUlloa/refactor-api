import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// Extiende la clase PrismaClient de Prisma (por eso tenés acceso a .user, .city, .claim, etc.).
//Se conecta automáticamente a la base cuando el módulo se inicia.