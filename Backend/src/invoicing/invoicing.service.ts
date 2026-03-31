import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicingService {
  constructor(private prisma: PrismaService) {}

  async createInvoice(dto: any) {
    // 1. Pre-check outside the transaction (Faster & Safer)
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) throw new BadRequestException('Product not found in Warehouse');
    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Insufficient stock. Only ${product.stock} bags available.`);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 2. Create Invoice
        const invoice = await tx.invoice.create({
          data: {
            invoiceNo: `INV-${Date.now()}`,
            totalAmount: product.price * dto.quantity,
            business: {
              connect: { id: dto.businessId }
            }
          },
        });

        // 3. Subtract Stock
        const updatedProduct = await tx.product.update({
          where: { id: dto.productId },
          data: {
            stock: { decrement: dto.quantity },
          },
        });

        return {
          message: 'Invoice created successfully!',
          invoice,
          remainingStock: updatedProduct.stock,
        };
      });
    } catch (error) {
      console.error("TRANSACTION ERROR:", error);
      // This ensures we get a clear message instead of a generic 500
      throw new InternalServerErrorException(error.message || 'Database Transaction Failed');
    }
  }
}