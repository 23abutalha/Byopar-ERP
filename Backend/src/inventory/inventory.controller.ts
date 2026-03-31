import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  add(@Body() dto: any) {
    return this.inventoryService.add(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard') // NEW: The Intelligence Endpoint
  getDashboard(@Query('businessId') businessId: string) {
    return this.inventoryService.getDashboard(businessId);
  }
}