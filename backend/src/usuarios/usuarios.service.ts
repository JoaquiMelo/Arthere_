import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type AtualizarPerfilDto = {
  nome?: string; especialidade?: string; bio?: string; cidade?: string; avatarUrl?: string;
  visivelNoMapa?: boolean; latitude?: number; longitude?: number; empresa?: string;
  telefone?: string; descricao?: string; site?: string; endereco?: string; categoria?: string;
};

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async meuPerfil(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: usuarioId }, include: { agente: true, contratante: true } });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    return { id: usuario.id, email: usuario.email, tipo: usuario.tipo, perfil: usuario.agente ?? usuario.contratante };
  }

  async atualizarMeuPerfil(usuarioId: string, tipo: TipoUsuario, dados: AtualizarPerfilDto) {
    if (tipo === TipoUsuario.AGENTE) {
      const perfil = await this.prisma.agenteCriativo.update({
        where: { usuarioId },
        data: { nome: dados.nome, especialidade: dados.especialidade, bio: dados.bio, cidade: dados.cidade, avatarUrl: dados.avatarUrl, visivelMapa: dados.visivelNoMapa, latitude: dados.latitude, longitude: dados.longitude },
      });
      return { perfil };
    }
    if (tipo === TipoUsuario.CONTRATANTE) {
      const perfil = await this.prisma.contratante.update({
        where: { usuarioId },
        data: { nome: dados.nome, empresa: dados.empresa, avatarUrl: dados.avatarUrl, telefone: dados.telefone, descricao: dados.descricao, site: dados.site, cidade: dados.cidade, endereco: dados.endereco, categoria: dados.categoria },
      });
      return { perfil };
    }
    throw new ForbiddenException('Administradores não possuem perfil público.');
  }
}
