export interface Agente {
  id: string;
  nome: string;
  especialidade: string;
  cidade: string;
  latitude: number;
  longitude: number;
  bio: string;
  telefone: string;
  foto?: string;
}

export interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  orcamento: string;
  localizacao: string;
}

// 1. Agentes simulados para aparecerem no Mapa
export const MOCK_AGENTES: Agente[] = [
  {
    id: '1',
    nome: 'Ana Clara (Fotógrafa)',
    especialidade: 'Fotografia',
    cidade: 'Santos - SP',
    latitude: -23.9608,
    longitude: -46.3339,
    bio: 'Fotógrafa especialista em retratos e eventos sociais.',
    telefone: '(13) 99999-1111',
  },
  {
    id: '2',
    nome: 'Carlos DJ',
    especialidade: 'Música',
    cidade: 'Santos - SP',
    latitude: -23.9680,
    longitude: -46.3280,
    bio: 'DJ residente em eventos corporativos e casamentos.',
    telefone: '(13) 99999-2222',
  },
  {
    id: '3',
    nome: 'Lucas Videomaker',
    especialidade: 'Videomaker',
    cidade: 'Mongaguá - SP',
    latitude: -24.0538,
    longitude: -46.6212,
    bio: 'Produção e edição de vídeos publicitários e clipes.',
    telefone: '(13) 99999-3333',
  },
];

// 2. Projetos simulados para a lista de vagas/oportunidades
export const MOCK_PROJETOS: Projeto[] = [
  {
    id: '1',
    titulo: 'Cobertura Fotográfica de Aniversário',
    categoria: 'Fotografia',
    orcamento: 'R$ 800,00',
    localizacao: 'Santos - SP',
    descricao: 'Preciso de um fotógrafo para evento de 4 horas no Gonzaga.',
  },
  {
    id: '2',
    titulo: 'DJ para Festa Corporativa',
    categoria: 'Música',
    orcamento: 'R$ 1.200,00',
    localizacao: 'Praia Grande - SP',
    descricao: 'Procuramos DJ com equipamento próprio para evento de fim de ano.',
  },
];

// 3. Usuário logado padrão para teste
export const MOCK_USUARIO_LOGADO = {
  id: 'user-001',
  nome: 'Joaquim Silva',
  email: 'usuario@teste.com',
  tipo: 'AGENTE',
  especialidade: 'Design & Arte',
  cidade: 'Santos - SP',
  latitude: -23.9608,
  longitude: -46.3339,
  bio: 'Criativo independente focado em identidades visuais e ilustrações.',
};