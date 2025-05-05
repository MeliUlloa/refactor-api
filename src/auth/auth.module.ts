// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTPassport } from './passport/jwt.passport';
import { JWTGuard } from './guard/jwt.guard';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SEED_DE_JWT', // clave secreta para verificar JWT
      signOptions: { expiresIn: '2h' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTPassport, JWTGuard, PrismaService],
  exports: [JWTGuard]
})
export class AuthModule { }
