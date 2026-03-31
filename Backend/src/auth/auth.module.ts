import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // This secret must be identical to the one in your jwt.strategy.ts
      secret: 'BYOPAR_MODEL_SECRET_2026_LAHORE', 
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  providers: [AuthService, JwtStrategy], 
  controllers: [AuthController],
  exports: [AuthService, PassportModule, JwtModule], 
})
export class AuthModule {}