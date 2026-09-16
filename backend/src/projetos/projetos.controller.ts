import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjetosService } from './projetos.service';

@Controller('projetos')
export class ProjetosController {
  constructor(private projetosService: ProjetosService) {}

  @Get()
  listar() {
    return this.projetosService.listar();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  criar(@Request() request: { user: { id: string } }, @Body() dados: any) {
    return this.projetosService.criar(request.user.id, dados);
  }

  @Post(':id/candidaturas')
  @UseGuards(JwtAuthGuard)
  candidatar(@Request() request: { user: { id: string } }, @Param('id') projetoId: string, @Body() dados: { mensagem?: string }) {
    return this.projetosService.candidatar(request.user.id, projetoId, dados.mensagem);
  }
}
