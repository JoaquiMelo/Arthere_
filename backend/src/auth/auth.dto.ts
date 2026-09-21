import { TipoUsuario } from '@prisma/client';

export class RegisterDto {
  email: string; senha: string; tipo: TipoUsuario; nome: string;
  especialidade?: string; empresa?: string; telefone?: string; descricao?: string;
  site?: string; cidade?: string; endereco?: string; categoria?: string;
}
export class LoginDto { email: string; senha: string; }
