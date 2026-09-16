import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AtualizarPerfilDto, UsuariosService } from './usuarios.service';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Get('me')
  me(@Request() request: { user: { id: string } }) {
    return this.usuariosService.meuPerfil(request.user.id);
  }

  @Patch('me')
  atualizar(
    @Request() request: { user: { id: string; tipo: 'AGENTE' | 'CONTRATANTE' | 'ADMIN' } },
    @Body() dados: AtualizarPerfilDto,
  ) {
    return this.usuariosService.atualizarMeuPerfil(request.user.id, request.user.tipo, dados);
  }
}
