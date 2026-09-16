import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type CriarProjetoDto = {
  titulo: string;
  descricao: string;
  categoria: string;
  orcamento?: number;
  dataEvento?: string;
};

@Injectable()
export class ProjetosService {
  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.projeto.findMany({
      where: { status: 'ABERTO' },
      include: { contratante: { select: { nome: true, empresa: true, avatarUrl: true } } },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async criar(usuarioId: string, dados: CriarProjetoDto) {
    const contratante = await this.prisma.contratante.findUnique({ where: { usuarioId } });
    if (!contratante) throw new ForbiddenException('Somente contratantes podem publicar oportunidades.');

    return this.prisma.projeto.create({
      data: {
        titulo: dados.titulo.trim(),
        descricao: dados.descricao.trim(),
        categoria: dados.categoria.trim(),
        orcamento: dados.orcamento,
        dataEvento: dados.dataEvento ? new Date(dados.dataEvento) : undefined,
        contratanteId: contratante.id,
      },
    });
  }

  async candidatar(usuarioId: string, projetoId: string, mensagem?: string) {
    const agente = await this.prisma.agenteCriativo.findUnique({ where: { usuarioId } });
    if (!agente) throw new ForbiddenException('Somente agentes criativos podem se candidatar.');

    const projeto = await this.prisma.projeto.findUnique({ where: { id: projetoId } });
    if (!projeto || projeto.status !== 'ABERTO') throw new NotFoundException('Oportunidade não está disponível.');

    try {
      return await this.prisma.candidatura.create({
        data: { agenteId: agente.id, projetoId, mensagem: mensagem?.trim() || undefined },
      });
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictException('Você já se candidatou a esta oportunidade.');
      throw error;
    }
  }
}
