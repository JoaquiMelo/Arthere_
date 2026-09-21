import type { VagaGerenciada } from '../types/management';

// agenteId corresponde aos agentes mocados em map-screen.tsx
export const MOCK_VAGAS_GERENCIADAS: VagaGerenciada[] = [
  {
    id: 'vaga-1', titulo: 'Cobertura fotográfica - Aniversário de 15 anos', categoria: 'Fotografia', orcamento: 1200,
    status: 'ABERTA', avaliado: false,
    candidatos: [
      { id: 'cand-1', agenteId: '1', nome: 'Marina Oliveira', avatarUrl: 'https://i.pravatar.cc/150?img=47', especialidade: 'Fotógrafa e videomaker', avaliacao: 4.9, mensagem: 'Tenho experiência com festas de 15 anos, posso enviar meu portfólio completo.', status: 'PENDENTE' },
      { id: 'cand-2', agenteId: '4', nome: 'Rafael Souza', avatarUrl: 'https://i.pravatar.cc/150?img=33', especialidade: 'Artesão', avaliacao: 4.6, mensagem: 'Também faço decoração temática, posso complementar o pacote.', status: 'PENDENTE' },
    ],
  },
  {
    id: 'vaga-2', titulo: 'DJ para festa corporativa de fim de ano', categoria: 'Música', orcamento: 1800,
    status: 'EM_ANDAMENTO', avaliado: false,
    candidatos: [
      { id: 'cand-3', agenteId: '3', nome: 'Beatriz Costa', avatarUrl: 'https://i.pravatar.cc/150?img=25', especialidade: 'DJ', avaliacao: 4.8, mensagem: 'Tenho equipamento próprio e repertório para eventos corporativos.', status: 'ACEITA' },
      { id: 'cand-4', agenteId: '2', nome: 'João Paulo', avatarUrl: 'https://i.pravatar.cc/150?img=12', especialidade: 'Videomaker', avaliacao: 4.7, mensagem: 'Posso gravar um recap do evento junto com a trilha sonora.', status: 'RECUSADA' },
    ],
  },
];
