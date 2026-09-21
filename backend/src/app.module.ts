import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProjetosModule } from './projetos/projetos.module';
import { EventosModule } from './eventos/eventos.module';

@Module({ imports: [PrismaModule, AuthModule, UsuariosModule, ProjetosModule, EventosModule], controllers: [AppController], providers: [AppService] })
export class AppModule {}
