import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { PrismaModule } from '../prisma.module';
import { PrismaService } from 'src/prisma.service';
import { LLMService } from 'src/llm/llm.service';

@Module({
  imports: [PrismaModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, PrismaService, LLMService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
