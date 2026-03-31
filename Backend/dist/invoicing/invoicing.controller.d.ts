import { InvoicingService } from './invoicing.service';
export declare class InvoicingController {
    private invoicingService;
    constructor(invoicingService: InvoicingService);
    create(dto: any): Promise<{
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
