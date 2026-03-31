import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async add(dto: any) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        stock: dto.stock,
        sku: dto.sku || `${dto.name.toUpperCase().replace(/ /g, '_')}_${Date.now()}`,
        business: { connect: { id: dto.businessId } }
      },
    });
  }

  async getDashboard(businessId: string) {
    // 1. Calculate Total Revenue from Invoices
    const salesReport = await this.prisma.invoice.aggregate({
      where: { businessId },
      _sum: { totalAmount: true },
      _count: { id: true }
    });

    // 2. Find Low Stock Items (Threshold: 40 for testing, usually 20)
    const lowStockItems = await this.prisma.product.findMany({
      where: { 
        businessId,
        stock: { lt: 40 } 
      },
      select: { name: true, stock: true }
    });

    // 3. Calculate Total Inventory Value (Stock * Price)
    const products = await this.prisma.product.findMany({
      where: { businessId }
    });
    
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

    return {
      totalRevenue: salesReport._sum.totalAmount || 0,
      totalInvoices: salesReport._count.id,
      inventoryValue: totalValue,
      lowStockAlerts: lowStockItems,
      totalProductTypes: products.length
    };
  }
}