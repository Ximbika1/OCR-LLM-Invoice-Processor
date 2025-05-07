import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
    imports: [InvoiceModule],
    controllers: [PdfController],
    providers: [PdfService],
})

export class PdfModule {}
