import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ClaimService } from './claim.service';
import { ClaimPaginatorDto } from './dto/claim-paginator.dto';
import { CreateClaimDto } from './dto/create-claim.dto';
import { Owner } from '@/common/decorators/user.decorator';

@Controller('claim')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  // Estádisticas por ciudad
  @Get('claim-location')
  async getReportByCity(@Query() paginator: ClaimPaginatorDto) {
    return this.claimService.getReportByCity(paginator);
  }

  // Crear un nuevo reclamo
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(@Body() data: any, @Owner() usuario: any) {
    return this.claimService.createClaim(data, usuario);
  }

  // Obtener todos los reclamos
  @Get()
  async findAll(@Query() p: ClaimPaginatorDto) {
    return this.claimService.getClaims(p);
  }

  // Obtener un reclamo específico por ID
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.claimService.getClaimById(id);
  }

  // Actualizar un reclamo
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: any) {
    return this.claimService.updateClaim(id, data);
  }

  // Eliminar un reclamo
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.claimService.deleteClaim(id);
  }
}
