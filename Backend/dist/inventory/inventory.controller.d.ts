import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private inventoryService;
    constructor(inventoryService: InventoryService);
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
