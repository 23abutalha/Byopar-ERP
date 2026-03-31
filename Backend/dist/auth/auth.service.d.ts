import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: any): Promise<{
        users: {
            id: string;
            email: string;
            passwordHash: string;
            businessId: string;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
    }>;
    login(dto: any): Promise<{
        access_token: string;
    }>;
}
