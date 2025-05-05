import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_CONSTANTS } from './constants/imports';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  // Crear un usuario
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new BadRequestException(USER_CONSTANTS.userAlreadyExists);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return newUser;
  }

  // Obtener todos los usuarios con paginación
  async findAll(page: string = '1', perPage: string = '10') {
    const skip = (parseInt(page) - 1) * parseInt(perPage);
    const take = parseInt(perPage);

    const users = await this.prisma.user.findMany({
      skip,
      take,
      where: { deleted: false },
      include: {
        userCity: {
          where: { city: { active: true, deleted: false } },
          include: { city: true },
        },
      },
    });

    const totalRecords = await this.prisma.user.count({ where: { deleted: false } });
    const lastPage = Math.ceil(totalRecords / take);

    return {
      data: users,
      metadata: {
        totalRecords,
        lastPage,
      },
    };
  }

  // Obtener un usuario por ID
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userCity: {
          where: { city: { active: true, deleted: false } },
          include: { city: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(USER_CONSTANTS.userNotFound);
    }

    return user;
  }

  // Actualizar un usuario
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(USER_CONSTANTS.userNotFound);
    }

    const {
      old_password,
      password,
      updateCityID = [],
      deletedCityID = [],
      ...rest
    } = updateUserDto;

    let dataToUpdate: any = { ...rest };

    if (old_password) {
      const passwordMatch = await bcrypt.compare(old_password, user.password);
      if (!passwordMatch) {
        throw new BadRequestException(USER_CONSTANTS.wrongPassword);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...dataToUpdate,
        userCity: {
          create: updateCityID.map((cityID) => ({ cityID })),
          deleteMany: deletedCityID.map((cityID) => ({ cityID })),
        },
      },
    });

    return updatedUser;
  }

  // Eliminar un usuario (marcar como eliminado)
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(USER_CONSTANTS.userNotFound);
    }

    await this.prisma.user.update({
      where: { id },
      data: { deleted: true, deletedDate: new Date() },
    });

    return USER_CONSTANTS.userDeleted;
  }
}
