import { PrismaService } from '../prisma/prisma.service';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    add(dto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        businessId: string;
        price: number;
        stock: number;
        sku: string;
    }>;
    getDashboard(businessId: string): Promise<{
        totalRevenue: number | import("@prisma/client-runtime-utils").Decimal;
        totalInvoices: number;
        inventoryValue: number;
        lowStockAlerts: {
            name: string;
            stock: number;
        }[];
        totalProductTypes: number;
    }>;
}
