import { Module } from '@nestjs/common';
import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';  // Falta el servicio

@Module({
  controllers: [ClaimController],
  providers: [ClaimService],  // Falta la definición del servicio
})
export class ClaimModule {}
