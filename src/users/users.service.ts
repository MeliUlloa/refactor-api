// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class UsersService {}
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPaginator } from './dto/user.paginator.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(p: UserPaginator) {
    let where: any = { deleted: false };

    if (p.name) {
      where.OR = [
        { name: { contains: p.name, mode: 'insensitive' } },
        { last_name: { contains: p.name, mode: 'insensitive' } },
      ];
    }

    if (p.id) where.id_visible = p.id;
    if (p.mail) where.mail = { contains: p.mail };
    if (p.username) where.username = { contains: p.username };
    if (p.active !== undefined) where.active = p.active;
    if (p.root) where.root = p.root;

    const totalRecords = await this.prisma.user.count({ where });
    const lastPage = Math.ceil(totalRecords / (p.perPage ?? 10));
    const skip = (p.page && p.perPage) ? (p.page - 1) * p.perPage : undefined;
    const take = p.perPage ?? 10;

    const orderBy = p.sortBy
      ? { [p.sortByProperty ?? 'id']: p.sortBy }
      : undefined;

    const data = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        userCity: {
          where: { city: { active: true, deleted: false } },
          include: { city: true },
        },
      },
    });

    const metadata = p.page && p.perPage
      ? { page: p.page, totalRecords, lastPage }
      : { totalRecords };

    return { data, metadata };
  }

  async findOne(id: string) {
    return this.prisma.user.findFirst({
      where: { id },
      include: {
        userCity: {
          where: { city: { active: true, deleted: false } },
          include: { city: true },
        },
      },
    });
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.old_password) {
      const same = bcrypt.compareSync(updateUserDto.old_password, user.password);
      if (!same) throw new UnauthorizedException('Wrong password');
      const hashPassword = bcrypt.hashSync(updateUserDto.password, 12);

      const result = await this.prisma.user.update({
        where: { id },
        data: {
          password: hashPassword,
          otp: updateUserDto.otp,
        },
      });

      const { password: _, ...updateUser } = result;
      return updateUser;
    } else {
      const { deletedCityID = [], updateCityID = [], ...rest } = updateUserDto;

      const result = await this.prisma.user.update({
        where: { id },
        data: {
          ...rest,
          userCity: {
            create: updateCityID.map((c) => ({ cityID: c })),
            deleteMany: deletedCityID.map((c) => ({ cityID: c })),
          },
        },
        include: {
          userCity: {
            where: { city: { active: true, deleted: false } },
            include: { city: true },
          },
        },
      });

      const { password: _, ...user } = result;
      return user;
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    await this.update(id, {
      deleted: true,
      deleteDate: new Date(),
    });

    return 'User removed';
  }

  async create(data: CreateUserDto) {
    const hashPassword = data.password
      ? bcrypt.hashSync(data.password, 12)
      : undefined;

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashPassword,
      },
    });
  }
}

// Aquí es donde Prisma conecta con modelo User:
// Este es el servicio principal donde usamos Prisma para CRUD