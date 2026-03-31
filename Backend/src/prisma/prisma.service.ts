import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = "postgresql://postgres:admin123@localhost:5432/byopar_db?schema=public";
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Connected to PostgreSQL (byopar_db) via Driver Adapter');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}