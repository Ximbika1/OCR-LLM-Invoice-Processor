import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from '../prisma.service';
import * as Tesseract from 'tesseract.js';
// biome-ignore lint/style/useImportType: <explanation>
import { LLMService } from '../llm/llm.service'; 

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService, private llmService: LLMService) {}
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

  // mode: insensitive do prisma não precisa e inutilizavel para MySQL 
  async searchInvoicesByName(userId: number, name: string) {
    return this.prisma.invoice.findMany({
      where: {
        userId,
        displayName: {
          contains: name,
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

  async askLLMAboutInvoice(invoiceId: number, userId: number, question: string) {
    
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: Number(invoiceId), userId },
    });

    if (!invoice) throw new Error('Fatura não encontrada');

    const prompt = `Texto da fatura:\n${invoice.extractedText}\n\nPergunta do usuário: ${question}`;
    const answer = await this.llmService.explainText(prompt);

    await this.prisma.interaction.create({
      data: {
        invoiceId,
        question,
        answer,
      },
    });

    return { question, answer };
  }

  async getExtractedTextById(id: string): Promise<string | null> {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: Number(id) } });
  
    return invoice?.extractedText || null;
  }

  async findByIdWithInteractions(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id: Number(id) },
      include: {
        interactions: true,
      },
    });
  }
}
