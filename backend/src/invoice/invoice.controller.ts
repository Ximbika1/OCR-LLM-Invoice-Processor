import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// biome-ignore lint/style/useImportType: <explanation>
import { InvoiceService } from './invoice.service';
import { diskStorage } from 'multer';
import * as path from 'node:path';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    }),
  }))
  async uploadInvoice(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = `/uploads/${file.filename}`; // URL acessível via static
    return this.invoiceService.processImage(file.path, fileUrl);
  }
}
