import React, { createContext, useContext, useMemo, useState } from 'react';

import { MOCK_VAGAS_GERENCIADAS } from '../features/opportunities/screens/data/mock-management';
import type { Candidato, VagaGerenciada } from '../features/opportunities/screens/types/management';

type NovaVaga = { titulo: string; categoria: string; orcamento?: number };

type ManagementContextType = {
  vagas: VagaGerenciada[];
  publicarVaga: (dados: NovaVaga) => void;
  aceitarCandidato: (vagaId: string, candidatoId: string) => void;
  recusarCandidato: (vagaId: string, candidatoId: string) => void;
  concluirVaga: (vagaId: string) => void;
  marcarAvaliado: (vagaId: string) => void;
};

const ManagementContext = createContext<ManagementContextType>({} as ManagementContextType);

export function ManagementProvider({ children }: { children: React.ReactNode }) {
  const [vagas, setVagas] = useState<VagaGerenciada[]>(MOCK_VAGAS_GERENCIADAS);

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

  const concluirVaga = (vagaId: string) => {
    setVagas((current) => current.map((vaga) => (vaga.id === vagaId ? { ...vaga, status: 'CONCLUIDA' } : vaga)));
  };

  const marcarAvaliado = (vagaId: string) => {
    setVagas((current) => current.map((vaga) => (vaga.id === vagaId ? { ...vaga, avaliado: true } : vaga)));
  };

  const value = useMemo(() => ({ vagas, publicarVaga, aceitarCandidato, recusarCandidato, concluirVaga, marcarAvaliado }), [vagas]);
  return <ManagementContext.Provider value={value}>{children}</ManagementContext.Provider>;
}

export const useManagement = () => useContext(ManagementContext);
