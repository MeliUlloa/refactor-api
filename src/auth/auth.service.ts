import { Injectable, BadRequestException, UnauthorizedException, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Payload } from './interfaces/payload.interface';
import { AUTH_CONSTANTS } from './constants/auth.constants';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('AUTH');

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    const admin = await this.user.findFirst({ where: { username: 'admin' } });
    if (!admin) {
      await this.user.create({
        data: {
          username: 'admin',
          mail: 'admin@admin.com',
          password: bcrypt.hashSync('admin2024', 12),
          root: true,
        },
      });
      this.logger.log('Root user created');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async validateUser(username: string, password: string) {
    const user = await this.user.findFirst({
      where: {
        OR: [{ username }, { mail: username }],
      },
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException(AUTH_CONSTANTS.invalidCredentials);
    }
    return user;
  }

  async login(user: any) {
    const payload: Payload = {
      sub: user.id,
      username: user.username,
      otp: user.otp,
    };
    return {
      token: this.jwtService.sign(payload),
      user: { ...user, password: undefined },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const exists = await this.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          { mail: createUserDto.mail },
        ],
      },
    });
    if (exists) throw new BadRequestException(AUTH_CONSTANTS.userExists);

    const newUser = await this.user.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 12),
        userCity: {
          create: createUserDto.updateCityID?.map(cityID => ({ cityID })),
        },
      },
    });
    const { password, ...rest } = newUser;
    return rest;
  }

  checkToken(token: string): boolean {
    try {
      return !!this.jwtService.verify(token);
    } catch {
      return false;
    }
  }
}
