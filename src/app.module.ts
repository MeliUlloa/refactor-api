import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JWTGuard } from './auth/guard/jwt.guard';
import { ClaimModule } from './claim/claim.module';
import { NeighborhoodModule } from './neighborhood/neighborhood.module';
import { CityModule } from './city/city.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ClaimModule,
    NeighborhoodModule,
    CityModule,
    ServeStaticModule.forRoot({
      rootPath: process.env.PRODUCTION
        ? process.env.UPLOADS_PATH
        : join(__dirname, '..', 'uploads'),
      serveRoot: '/api/uploads',
    }),
    PrismaModule,
  ],
  providers: [{ provide: 'APP_GUARD', useClass: JWTGuard }],
})
export class AppModule {}
