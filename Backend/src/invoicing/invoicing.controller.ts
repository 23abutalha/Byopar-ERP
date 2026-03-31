import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { InvoicingService } from './invoicing.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('invoicing')
export class InvoicingController {
  constructor(private invoicingService: InvoicingService) {}

  @UseGuards(AuthGuard('jwt')) // Only logged-in users can sell!
  @Post('create')
  create(@Body() dto: any) {
    return this.invoicingService.createInvoice(dto);
  }
}