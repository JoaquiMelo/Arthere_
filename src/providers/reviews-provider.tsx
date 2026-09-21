import React, { createContext, useContext, useMemo, useState } from 'react';

import { MOCK_AVALIACOES } from '@/features/reviews/data/mock-reviews';
import type { Avaliacao } from '@/features/reviews/types/review';

type NovaAvaliacao = { agenteId: string; autorNome: string; nota: number; comentario?: string };

type ReviewsContextType = {
  avaliacoes: Avaliacao[];
  avaliacoesPorAgente: (agenteId: string) => Avaliacao[];
  mediaPorAgente: (agenteId: string) => number;
  adicionarAvaliacao: (dados: NovaAvaliacao) => void;
};

const ReviewsContext = createContext<ReviewsContextType>({} as ReviewsContextType);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(MOCK_AVALIACOES);

  const avaliacoesPorAgente = (agenteId: string) =>
    avaliacoes.filter((item) => item.agenteId === agenteId).sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime());

  const mediaPorAgente = (agenteId: string) => {
    const lista = avaliacoesPorAgente(agenteId);
    if (!lista.length) return 0;
    return lista.reduce((soma, item) => soma + item.nota, 0) / lista.length;
  };

  const adicionarAvaliacao = ({ agenteId, autorNome, nota, comentario }: NovaAvaliacao) => {
    setAvaliacoes((current) => [
      { id: `av-${Date.now()}`, agenteId, autorNome, nota, comentario: comentario?.trim() || undefined, criadoEm: new Date() },
      ...current,
    ]);
  };

  const value = useMemo(() => ({ avaliacoes, avaliacoesPorAgente, mediaPorAgente, adicionarAvaliacao }), [avaliacoes]);
  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export const useReviews = () => useContext(ReviewsContext);
