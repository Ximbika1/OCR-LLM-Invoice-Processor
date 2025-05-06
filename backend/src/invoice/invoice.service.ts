import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from '../prisma.service';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async processImage(filePath: string, fileUrl: string) {
    const result = await Tesseract.recognize(filePath, 'eng');

    const invoice = await this.prisma.invoice.create({
      data: {
        fileUrl,
        date: new Date(),
        extractedText: result.data.text,
        amount: 0, // preencher depois
        cnpj: '',
        companyName: '',
        invoiceNumber: '',
        userId: 1, // ajustar com autenticação depois
      },
    });

    return invoice;
  }

  async getAllInvoices() {
    return this.prisma.invoice.findMany({
      orderBy: { date: 'desc' },
    });
  }
}
