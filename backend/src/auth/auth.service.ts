import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const existe = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existe) throw new ConflictException('Email já cadastrado.');

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        email: dto.email,
        senha: senhaHash,
        tipo: dto.tipo,
        ...(dto.tipo === 'AGENTE'
          ? { agente: { create: { nome: dto.nome, especialidade: dto.especialidade ?? '', cidade: '', endereco: '' } } }
          : { contratante: { create: { nome: dto.nome, empresa: dto.empresa } } }),
      },
      include: { agente: true, contratante: true },
    });

    return this.gerarToken(usuario);
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      include: { agente: true, contratante: true },
    });
    if (!usuario) throw new UnauthorizedException('Email ou senha inválidos.');

    const ok = await bcrypt.compare(dto.senha, usuario.senha);
    if (!ok) throw new UnauthorizedException('Email ou senha inválidos.');

    return this.gerarToken(usuario);
  }

  private gerarToken(usuario: any) {
    const payload = { sub: usuario.id, email: usuario.email, tipo: usuario.tipo };
    return {
      access_token: this.jwt.sign(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo,
        perfil: usuario.agente ?? usuario.contratante,
      },
    };
  }
}
