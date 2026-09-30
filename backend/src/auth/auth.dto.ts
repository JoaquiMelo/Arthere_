import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsIn(['AGENTE', 'CONTRATANTE'])
  tipo: 'AGENTE' | 'CONTRATANTE';

  @IsString()
  @MinLength(2)
  nome: string;

  @IsOptional() @IsString() especialidade?: string;
  @IsOptional() @IsString() empresa?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsString() site?: string;
  @IsOptional() @IsString() cidade?: string;
  @IsOptional() @IsString() endereco?: string;
  @IsOptional() @IsString() categoria?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;
}
