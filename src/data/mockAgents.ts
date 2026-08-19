import { AgenteCriativo } from '../types/agents';

export const mockAgentes: AgenteCriativo[] = [
  {
    id: '1',
    nome: 'BRUNO TAVARES',
    categoria: 'artesanato',
    disponivel: true,
    avaliacao: 4.9,
    cidade: 'São Paulo',
    latitude: -23.555,
    longitude: -46.67,
    fotoUrl: 'https://i.pravatar.cc/150?img=11',
    descricao:
      'Ceramista e marceneiro. Peças autorais em madeira e cerâmica, mobiliário artesanal sob encomenda e workshops mensais.',
    portfolio: [
      {
        id: 'p1',
        titulo: 'Portfólio 1',
        imagemUrl:
          'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200',
      },
      { id: 'p2', titulo: 'Portfólio 2' },
    ],
  },
];
