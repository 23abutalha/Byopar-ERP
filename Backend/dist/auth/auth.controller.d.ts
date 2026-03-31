import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
