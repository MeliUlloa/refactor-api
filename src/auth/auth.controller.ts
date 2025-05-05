import { Controller, Post, Body, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from '@/common/decorators/public.decorator'; // decorador personalizado para rutas sin protección JWT
import { Owner } from '@/common/decorators/user.decorator';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @PublicRoute()
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    return this.authService.login(user);
  }

  @Post('register')
  @PublicRoute()
  async register(@Body() dto: CreateUserDto, @Owner() owner: any) {
    dto['id_user'] = owner?.id;
    return await this.authService.register(dto);
  }

  @Post('check')
  @PublicRoute()
  check(@Body('token') token: string) {
    return this.authService.checkToken(token);
  }

  @Get('info')
  getUserInfo(@Owner() user: any) {
    return user;
  }
}
