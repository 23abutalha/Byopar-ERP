import { PrismaService } from '../prisma/prisma.service';
export declare class InvoicingService {
    private prisma;
    constructor(prisma: PrismaService);
    createInvoice(dto: any): Promise<{
        message: string;
        invoice: {
            id: string;
            createdAt: Date;
            businessId: string;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            invoiceNo: string;
        };
        remainingStock: number;
    }>;
}
