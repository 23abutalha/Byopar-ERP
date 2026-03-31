import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // Add this
  ) {}

  async register(dto: any) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.business.create({
      data: {
        name: dto.name,
        slug: dto.name.toLowerCase().replace(/ /g, '-'),
        users: {
          create: {
            email: dto.email,
            passwordHash: hashedPassword,
          },
        },
      },
      include: { users: true },
    });
  }

  async login(dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, businessId: user.businessId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}