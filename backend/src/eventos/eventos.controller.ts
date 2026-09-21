import { Controller, Get, Query } from '@nestjs/common';
import { EventosService } from './eventos.service';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}
  @Get()
  listar(@Query('cidade') cidade?: string) { return this.eventosService.listar(cidade); }
}
