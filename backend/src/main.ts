import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// biome-ignore lint/style/useImportType: <explanation>
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  })

  // Cria a pasta uploads se não existir
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Serve a pasta uploads como arquivos estáticos
  app.useStaticAssets(uploadDir, {
    prefix: '/uploads',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
