import { Controller, Get, Param, Res } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Response } from 'express';
import * as PDFDocument from 'pdfkit'; 
import * as path from 'path';
// biome-ignore lint/style/useImportType: <explanation>
import { InvoiceService } from '../invoice/invoice.service';
import * as fs from 'fs';

@Controller('download')
export class PdfController {
  constructor(
    private readonly invoiceService: InvoiceService,
  ) {}

  @Get('invoice/:id')
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    try {

        const invoice = await this.invoiceService.findByIdWithInteractions(id);
        if (!invoice) return res.status(404).send('Fatura não encontrada');
      
        const fileUrl = path.join(process.cwd(), invoice.fileUrl)
        console.log('Caminho da imagem:', fileUrl); // Verifique o caminho da imagem no console

        if (!fs.existsSync(fileUrl)) {
            return res.status(404).send('Imagem da fatura não encontrada');
        }

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

        doc.image(fileUrl, { width: 500, align: 'center' });

        // Adicionando as interações (perguntas e respostas)
        doc.moveDown().text('Interações com a fatura:', { underline: true });
        invoice.interactions.forEach((interaction, index) => {
            doc.moveDown().text(`Pergunta ${index + 1}: ${interaction.question}`);
            doc.text(`Resposta: ${interaction.answer}`);
            doc.moveDown();
        });

        // Finalizar o documento
        doc.end();
        } catch (error) {
        console.error(error);
        return res.status(500).send('Erro ao gerar PDF');
        }
  }
}
