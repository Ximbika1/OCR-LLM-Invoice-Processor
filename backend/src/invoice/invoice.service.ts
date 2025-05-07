import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from '../prisma.service';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}
  async processImage(filePath: string, fileUrl: string, userId: number, displayName?: string) {
    const result = await Tesseract.recognize(filePath, 'eng');

    const invoice = await this.prisma.invoice.create({
      data: {
        fileUrl,
        date: new Date(),
        extractedText: result.data.text,
        amount: 0,
        cnpj: '',
        companyName: '',
        invoiceNumber: '',
        userId,
        displayName: displayName || "",
      },
    });

    return invoice;
  }

  async getInvoiceById(id: number, userId: number) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id,
        userId, // garantir que só vai ver invoice do dono
      },
    });
  
    if (!invoice) {
      throw new Error('Nota fiscal não encontrada');
    }
  
    return invoice;
  }

  async deleteInvoice(id: number, userId: number) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, userId },
    });
  
    if (!invoice) {
      throw new Error('Nota fiscal não encontrada');
    }
  
    await this.prisma.invoice.delete({
      where: { id },
    });
  
    return { message: 'Nota fiscal deletada com sucesso' };
  }

  // versao do prisma 6.7.0 não funciona o mode
  async searchInvoicesByName(userId: number, name: string) {
    return this.prisma.invoice.findMany({
      where: {
        userId,
        displayName: {
          contains: name.toLowerCase(),
          // mode: 'insensitive', // busca sem diferenciar maiúsculas/minúsculas
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getAllInvoices(userId: number) {
    return this.prisma.invoice.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }
}
