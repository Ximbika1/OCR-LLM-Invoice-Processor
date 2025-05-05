import { Injectable } from '@nestjs/common';
import type { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();  //consulta de usuarios
  }
}
