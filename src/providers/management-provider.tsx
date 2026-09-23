import React, { createContext, useMemo, useState } from 'react';
import { MOCK_VAGAS_GERENCIADAS } from '../features/opportunities/screens/data/mock-management';
import type { Candidato, VagaGerenciada } from '../features/opportunities/screens/types/management';

type NovaVaga = { titulo: string; categoria: string; orcamento?: number };

export type SolicitacaoEvento = {
  id: string;
  eventId: string;
  eventoTitulo: string;
  agenteId: string;
  agenteNome: string;
  agenteEspecialidade: string;
  mensagem: string;
  status: 'PENDENTE' | 'ACEITA' | 'RECUSADA';
};

type ManagementContextType = {
  vagas: VagaGerenciada[];
  solicitacoesEvento: SolicitacaoEvento[];
  publicarVaga: (dados: NovaVaga) => void;
  aceitarCandidato: (vagaId: string, candidatoId: string) => void;
  recusarCandidato: (vagaId: string, candidatoId: string) => void;
  concluirVaga: (vagaId: string) => void;
  marcarAvaliado: (vagaId: string) => void;
  enviarSolicitacaoEvento: (dados: Omit<SolicitacaoEvento, 'id' | 'status'>) => void;
  aceitarSolicitacaoEvento: (solicitacaoId: string) => void;
  recusarSolicitacaoEvento: (solicitacaoId: string) => void;
};

const ManagementContext = createContext<ManagementContextType>({} as ManagementContextType);

export function ManagementProvider({ children }: { children: React.ReactNode }) {
  const [vagas, setVagas] = useState<VagaGerenciada[]>(MOCK_VAGAS_GERENCIADAS);
  const [solicitacoesEvento, setSolicitacoesEvento] = useState<SolicitacaoEvento[]>([]);

  const publicarVaga = ({ titulo, categoria, orcamento }: NovaVaga) => {
    setVagas((current) => [{ id: `vaga-${Date.now()}`, titulo, categoria, orcamento, status: 'ABERTA', avaliado: false, candidatos: [] }, ...current]);
  };

  const atualizarCandidato = (vagaId: string, candidatoId: string, status: Candidato['status']) => {
    setVagas((current) => current.map((vaga) => {
      if (vaga.id !== vagaId) return vaga;
      const candidatos = vaga.candidatos.map((candidato) => {
        if (candidato.id === candidatoId) return { ...candidato, status };
        if (status === 'ACEITA' && candidato.status === 'PENDENTE') return { ...candidato, status: 'RECUSADA' as const };
        return candidato;
      });
      return { ...vaga, candidatos, status: status === 'ACEITA' ? 'EM_ANDAMENTO' : vaga.status };
    }));
  };

  const aceitarCandidato = (vagaId: string, candidatoId: string) => atualizarCandidato(vagaId, candidatoId, 'ACEITA');
  const recusarCandidato = (vagaId: string, candidatoId: string) => atualizarCandidato(vagaId, candidatoId, 'RECUSADA');
  const concluirVaga = (vagaId: string) => setVagas((current) => current.map((vaga) => (vaga.id === vagaId ? { ...vaga, status: 'CONCLUIDA' } : vaga)));
  const marcarAvaliado = (vagaId: string) => setVagas((current) => current.map((vaga) => (vaga.id === vagaId ? { ...vaga, avaliado: true } : vaga)));

  const enviarSolicitacaoEvento = (dados: Omit<SolicitacaoEvento, 'id' | 'status'>) => {
    setSolicitacoesEvento((current) => {
      const jaExiste = current.some((item) => item.eventId === dados.eventId && item.agenteId === dados.agenteId && item.status === 'PENDENTE');
      if (jaExiste) return current;
      return [{ ...dados, id: `sol-evento-${Date.now()}`, status: 'PENDENTE' }, ...current];
    });
  };

  const atualizarSolicitacaoEvento = (solicitacaoId: string, status: SolicitacaoEvento['status']) => {
    setSolicitacoesEvento((current) => current.map((item) => item.id === solicitacaoId ? { ...item, status } : item));
  };

  const aceitarSolicitacaoEvento = (solicitacaoId: string) => atualizarSolicitacaoEvento(solicitacaoId, 'ACEITA');
  const recusarSolicitacaoEvento = (solicitacaoId: string) => atualizarSolicitacaoEvento(solicitacaoId, 'RECUSADA');

  const value = useMemo(() => ({
    vagas,
    solicitacoesEvento,
    publicarVaga,
    aceitarCandidato,
    recusarCandidato,
    concluirVaga,
    marcarAvaliado,
    enviarSolicitacaoEvento,
    aceitarSolicitacaoEvento,
    recusarSolicitacaoEvento,
  }), [vagas, solicitacoesEvento]);

  return <ManagementContext.Provider value={value}>{children}</ManagementContext.Provider>;
}

export const useManagement = () => React.useContext(ManagementContext);
