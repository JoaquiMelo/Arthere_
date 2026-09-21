import type { Avaliacao } from '../types/review';

// IDs correspondem aos agentes mocados em map-screen.tsx (1 = Marina, 2 = João Paulo, 3 = Beatriz, 4 = Rafael)
export const MOCK_AVALIACOES: Avaliacao[] = [
  { id: 'av-1', agenteId: '1', autorNome: 'Bruno Ferreira', nota: 5, comentario: 'Trabalho impecável, superou as expectativas no casamento da minha irmã.', criadoEm: new Date('2026-08-02') },
  { id: 'av-2', agenteId: '1', autorNome: 'Vitrine Eventos', nota: 5, comentario: 'Entrega rápida e ótima comunicação durante todo o projeto.', criadoEm: new Date('2026-07-18') },
  { id: 'av-3', agenteId: '1', autorNome: 'Carla Menezes', nota: 4, comentario: 'Fotos lindas, só atrasou um pouco a entrega final.', criadoEm: new Date('2026-06-30') },
  { id: 'av-4', agenteId: '2', autorNome: 'Studio Nexus', nota: 5, comentario: 'Vídeo institucional ficou excelente, recomendo.', criadoEm: new Date('2026-08-10') },
  { id: 'av-5', agenteId: '2', autorNome: 'Fernanda Lopes', nota: 4, comentario: 'Bom profissional, entrega dentro do prazo combinado.', criadoEm: new Date('2026-07-02') },
  { id: 'av-6', agenteId: '3', autorNome: 'Eventos Maré Alta', nota: 5, comentario: 'Animou a festa toda, contrataremos de novo.', criadoEm: new Date('2026-08-15') },
  { id: 'av-7', agenteId: '4', autorNome: 'Paulo Henrique', nota: 5, comentario: 'Peça em madeira ficou linda, muito capricho no acabamento.', criadoEm: new Date('2026-07-25') },
];
