import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    Request,
    Get,
    Body,
    Delete,
    Param,
    Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// biome-ignore lint/style/useImportType: <explanation>
import { InvoiceService } from './invoice.service';
import { diskStorage } from 'multer';
import * as path from 'node:path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // importe o guard
  
@Controller('invoice')
@UseGuards(JwtAuthGuard) // aplica o guard em todas as rotas desse controller
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}
  
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    const ext = path.extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    async uploadInvoice(
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
        @Body() body: { displayName?: string},
    ) {
        const fileUrl = `/uploads/${file.filename}`;
        const userId = req.user.id; // pega do token
        return this.invoiceService.processImage(file.path, fileUrl, userId, body.displayName);
    }
  
    @Get()
    async getAllInvoices(@Request() req) {
        const userId = req.user.id;
        return this.invoiceService.getAllInvoices(userId);
    }

    @Get(':id')
    async getInvoice(@Param('id') id: string, @Request() req) {
        const userId = req.user.id;
        return this.invoiceService.getInvoiceById(Number(id), userId);
    }

    @Get('search')
    async searchInvoices(@Request() req, @Query('name') name: string) {
        const userId = req.user.id;
        return this.invoiceService.searchInvoicesByName(userId, name || '');
    }

    @Delete(':id')
    async deleteInvoice(@Param('id') id: string, @Request() req) {
        const userId = req.user.id;
        return this.invoiceService.deleteInvoice(Number(id), userId);
    }
}
  