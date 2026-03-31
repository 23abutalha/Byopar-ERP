"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async add(dto) {
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
    async getDashboard(businessId) {
        const salesReport = await this.prisma.invoice.aggregate({
            where: { businessId },
            _sum: { totalAmount: true },
            _count: { id: true }
        });
        const lowStockItems = await this.prisma.product.findMany({
            where: {
                businessId,
                stock: { lt: 40 }
            },
            select: { name: true, stock: true }
        });
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
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map