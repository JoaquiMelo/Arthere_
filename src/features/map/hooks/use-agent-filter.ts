import { useMemo } from 'react';
import type { AgenteCriativo } from '@/features/agents/types/agent';
import { CATEGORIAS } from '@/shared/config/categories';

export function useAgentFilter(agentes: AgenteCriativo[], busca: string, categoria: string | null) {
  return useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return agentes.filter((agente) => {
      if (categoria && agente.categoria !== categoria) return false;
      if (!termo) return true;
      const categoriaLabel = CATEGORIAS[agente.categoria]?.label.toLowerCase() ?? '';
      return [agente.nome, agente.cidade, categoriaLabel, ...agente.especialidades]
        .some((campo) => campo.toLowerCase().includes(termo));
    });
  }, [agentes, busca, categoria]);
}
