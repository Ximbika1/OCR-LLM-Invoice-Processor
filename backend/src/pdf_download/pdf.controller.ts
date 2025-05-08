import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import { InvoiceService } from '../invoice/invoice.service';

@Controller('download')
export class PdfController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('invoice/:id')
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const invoice = await this.invoiceService.findByIdWithInteractions(id);
      if (!invoice) return res.status(404).send('Fatura não encontrada');

      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="invoice-${invoice.id}.pdf"`,
        });
        res.send(pdfBuffer);
      });

      doc.fontSize(16).text('Texto extraído da fatura:', { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(invoice.extractedText || 'Nenhum texto extraído disponível.');
      doc.moveDown();

      doc.fontSize(16).text('Interações com a fatura:', { underline: true });
      doc.moveDown();

      invoice.interactions.forEach((interaction, index) => {
        doc.fontSize(12).text(`Pergunta ${index + 1}: ${interaction.question}`);
        doc.text(`Resposta: ${interaction.answer}`);
        doc.moveDown();
      });

      doc.end();
    } catch (error) {
      console.error(error);
      return res.status(500).send('Erro ao gerar PDF');
    }
  }
}
