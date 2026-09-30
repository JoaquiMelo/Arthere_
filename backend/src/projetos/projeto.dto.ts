import { Type } from 'class-transformer';
import { IsISO8601, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CriarProjetoDto {
  @IsString() @MinLength(2)
  titulo: string;

  @IsString() @MinLength(2)
  descricao: string;

  @IsString() @MinLength(2)
  categoria: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  orcamento?: number;

  @IsOptional()
  @IsISO8601()
  dataEvento?: string;
}

export class CandidaturaDto {
  @IsOptional() @IsString() @MinLength(1)
  mensagem?: string;
}
