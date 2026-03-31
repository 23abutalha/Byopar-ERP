import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InventoryService } from './inventory/inventory.service';
import { InventoryController } from './inventory/inventory.controller';
import { InvoicingService } from './invoicing/invoicing.service';
import { InvoicingController } from './invoicing/invoicing.controller';

@Module({
  imports: [PrismaModule, AuthModule], // We use AuthModule here now
  controllers: [InventoryController, InvoicingController],
  providers: [InventoryService, InvoicingService],
})
export class AppModule {}