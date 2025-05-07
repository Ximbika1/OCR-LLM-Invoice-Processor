import { Injectable, UnauthorizedException } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new UnauthorizedException('Usuário não encontrado');


        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) throw new UnauthorizedException('Senha inválida');

        return user;
    }

    async login(user: { id: number; email: string }) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(data: { email: string; password: string; name?: string }) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
    
        if (existingUser) {
            throw new BadRequestException('Email já está em uso.');
        }

        const hashed = await bcrypt.hash(data.password, 10);  
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashed,
                name: data.name || "",
            },
        });
        return this.login(user);
  }
}
