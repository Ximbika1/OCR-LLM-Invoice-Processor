import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { InvoiceModule } from './invoice/invoice.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [InvoiceModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
