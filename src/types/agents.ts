export interface PortfolioItem {
  id: string;
  imagemUrl?: string;
  titulo: string;
}

export interface AgenteCriativo {
  id: string;
  nome: string;
  categoria: string;
  disponivel: boolean;
  avaliacao: number;
  cidade: string;
  latitude: number;
  longitude: number;
  fotoUrl: string;
  descricao: string;
  portfolio: PortfolioItem[];
}
