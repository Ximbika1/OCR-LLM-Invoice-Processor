import axios from 'axios';
import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
    async generateInvoicePDF(invoice: any): Promise<Buffer> {
        const doc = new PDFDocument();
        const buffers: Uint8Array[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {});

        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const imageUrl = `${baseUrl}${invoice.fileUrl}`;

        try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        doc.image(response.data, { width: 500 });
        } catch (err) {
        doc.text('Imagem não disponível');
        }

        doc.moveDown();
        doc.fontSize(14).text('Interações:');
        invoice.interactions.forEach((interaction: any, index: number) => {
        doc
            .moveDown()
            .fontSize(12)
            .text(`Pergunta ${index + 1}: ${interaction.question}`)
            .text(`Resposta: ${interaction.answer}`);
        });

        doc.end();
        return Buffer.concat(buffers);
    }
}
