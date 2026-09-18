import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// TODO: confirme se o caminho de importação bate com a estrutura real do projeto Arthere
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const PORTFOLIO_ITEM_SIZE_3COL = (width - 48) / 3;
const PORTFOLIO_ITEM_SIZE_2COL = (width - 40) / 2;

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface Avaliacao {
  id: string;
  nomeAvaliador: string;
  avatarAvaliador: string;
  nota: number;
  comentario: string;
  data: string;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  titulo?: string;
  descricao?: string;
}

export interface AgentePerfil {
  id: string;
  nome: string;
  especialidade: string;
  bio: string;
  cidade: string;
  avatarUrl: string;
  notaMedia: number;
  totalAvaliacoes: number;
  totalProjetos: number;
  portfolio: PortfolioItem[];
  avaliacoes: Avaliacao[];
}

type LayoutPortfolio = 'grid3' | 'grid2' | 'lista';

// ─── Dados mock ───────────────────────────────────────────────────────────────
const agenteMock: AgentePerfil = {
  id: '1',
  nome: 'Marina Oliveira',
  especialidade: 'Fotógrafa & Videomaker',
  bio: 'Especializada em retratos editoriais e cobertura de eventos culturais. Apaixonada por capturar histórias através das lentes há mais de 8 anos.',
  cidade: 'São Paulo, SP',
  avatarUrl: 'https://i.pravatar.cc/150?img=47',
  notaMedia: 4.8,
  totalAvaliacoes: 127,
  totalProjetos: 94,
  portfolio: [
    { id: 'p1', imageUrl: 'https://picsum.photos/seed/p1/300/300', titulo: 'Ensaio urbano', descricao: 'Sessão de retratos no centro de São Paulo.' },
    { id: 'p2', imageUrl: 'https://picsum.photos/seed/p2/300/300', titulo: 'Casamento Ana & Bruno', descricao: 'Cobertura completa da cerimônia e festa.' },
    { id: 'p3', imageUrl: 'https://picsum.photos/seed/p3/300/300', titulo: 'Editorial de moda' },
    { id: 'p4', imageUrl: 'https://picsum.photos/seed/p4/300/300', titulo: 'Evento cultural' },
    { id: 'p5', imageUrl: 'https://picsum.photos/seed/p5/300/300' },
    { id: 'p6', imageUrl: 'https://picsum.photos/seed/p6/300/300' },
  ],
  avaliacoes: [
    {
      id: 'a1',
      nomeAvaliador: 'Carlos Mendes',
      avatarAvaliador: 'https://i.pravatar.cc/50?img=12',
      nota: 5,
      comentario: 'Trabalho incrível! Marina superou todas as expectativas no nosso evento.',
      data: 'Jun 2025',
    },
    {
      id: 'a2',
      nomeAvaliador: 'Beatriz Costa',
      avatarAvaliador: 'https://i.pravatar.cc/50?img=25',
      nota: 5,
      comentario: 'Profissional impecável, entregou tudo no prazo e com qualidade excepcional.',
      data: 'Mai 2025',
    },
    {
      id: 'a3',
      nomeAvaliador: 'Rafael Souza',
      avatarAvaliador: 'https://i.pravatar.cc/50?img=33',
      nota: 4,
      comentario: 'Ótimo trabalho! As fotos ficaram lindas, recomendo muito.',
      data: 'Abr 2025',
    },
  ],
};

// ─── Componente de estrelas ───────────────────────────────────────────────────
function Estrelas({ nota, tamanho = 14 }: { nota: number; tamanho?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.round(nota) ? 'star' : 'star-outline'}
          size={tamanho}
          color="#F59E0B"
        />
      ))}
    </View>
  );
}

// ─── Card de avaliação ────────────────────────────────────────────────────────
function CardAvaliacao({ item }: { item: Avaliacao }) {
  return (
    <View style={styles.cardAvaliacao}>
      <View style={styles.avaliacaoHeader}>
        <Image source={{ uri: item.avatarAvaliador }} style={styles.avatarAvaliador} />
        <View style={{ flex: 1 }}>
          <Text style={styles.nomeAvaliador}>{item.nomeAvaliador}</Text>
          <Estrelas nota={item.nota} />
        </View>
        <Text style={styles.dataAvaliacao}>{item.data}</Text>
      </View>
      <Text style={styles.comentario}>{item.comentario}</Text>
    </View>
  );
}

// ─── Tela Principal ───────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const agente = agenteMock;
  const navigation = useNavigation<any>();
  const [abaAtiva, setAbaAtiva] = useState<'portfolio' | 'avaliacoes'>('portfolio');
  const [layoutPortfolio, setLayoutPortfolio] = useState<LayoutPortfolio>('grid3');

  // TODO: troque por uma verificação real (ex: comparar agente.id com o usuário logado no AuthContext)
  const isOwnProfile = true;

  const abrirEdicaoPerfil = () => {
    navigation.navigate('EditProfile', { agente });
  };

  const abrirEdicaoPortfolio = (itemId?: string) => {
    navigation.navigate('PortfolioCreation', {
      portfolio: agente.portfolio,
      focarItemId: itemId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header fixo com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Perfil</Text>
        <View style={styles.headerAcoes}>
          {isOwnProfile && (
            <TouchableOpacity style={styles.btnVoltar} onPress={abrirEdicaoPerfil}>
              <Ionicons name="create-outline" size={20} color="#111" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btnVoltar}>
            <Ionicons name="share-social-outline" size={22} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ── Seção Hero ─────────────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: agente.avatarUrl }} style={styles.avatar} />
            <View style={styles.badgeOnline} />
            {isOwnProfile && (
              <TouchableOpacity style={styles.btnEditarFoto} onPress={abrirEdicaoPerfil}>
                <Ionicons name="camera" size={14} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.nome}>{agente.nome}</Text>
          <Text style={styles.especialidade}>{agente.especialidade}</Text>

          <View style={styles.localRow}>
            <Ionicons name="location-outline" size={14} color="#7C3AED" />
            <Text style={styles.localTexto}>{agente.cidade}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumero}>{agente.notaMedia}</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumero}>{agente.totalAvaliacoes}</Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumero}>{agente.totalProjetos}</Text>
              <Text style={styles.statLabel}>Projetos</Text>
            </View>
          </View>
        </View>

        {/* ── Bio ────────────────────────────────────────────── */}
        <View style={styles.secao}>
          <View style={styles.secaoHeaderRow}>
            <Text style={styles.secaoTitulo}>Sobre</Text>
            {isOwnProfile && (
              <TouchableOpacity onPress={abrirEdicaoPerfil} hitSlop={8}>
                <Ionicons name="pencil" size={16} color="#7C3AED" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.bioTexto}>{agente.bio}</Text>
        </View>

        {/* ── Botões de ação ─────────────────────────────────── */}
        {isOwnProfile ? (
          <View style={styles.botoesRow}>
            <TouchableOpacity style={styles.btnEditarPerfilFull} onPress={abrirEdicaoPerfil}>
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.btnAgendarTexto}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.botoesRow}>
            <TouchableOpacity style={styles.btnChat}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#EC1B4B" />
              <Text style={styles.btnChatTexto}>Mensagem</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnAgendar}>
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={styles.btnAgendarTexto}>Agendar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Abas: Portfólio / Avaliações ───────────────────── */}
        <View style={styles.abasRow}>
          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'portfolio' && styles.abaAtiva]}
            onPress={() => setAbaAtiva('portfolio')}
          >
            <Text style={[styles.abaTexto, abaAtiva === 'portfolio' && styles.abaTextoAtivo]}>
              Portfólio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'avaliacoes' && styles.abaAtiva]}
            onPress={() => setAbaAtiva('avaliacoes')}
          >
            <Text style={[styles.abaTexto, abaAtiva === 'avaliacoes' && styles.abaTextoAtivo]}>
              Avaliações
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Conteúdo da aba ────────────────────────────────── */}
        {abaAtiva === 'portfolio' ? (
          <View>
            {isOwnProfile && (
              <View style={styles.portfolioToolbar}>
                <View style={styles.layoutSwitcher}>
                  <TouchableOpacity
                    style={[styles.layoutBtn, layoutPortfolio === 'grid3' && styles.layoutBtnAtivo]}
                    onPress={() => setLayoutPortfolio('grid3')}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={16}
                      color={layoutPortfolio === 'grid3' ? '#fff' : '#64748B'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.layoutBtn, layoutPortfolio === 'grid2' && styles.layoutBtnAtivo]}
                    onPress={() => setLayoutPortfolio('grid2')}
                  >
                    <Ionicons
                      name="apps-outline"
                      size={16}
                      color={layoutPortfolio === 'grid2' ? '#fff' : '#64748B'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.layoutBtn, layoutPortfolio === 'lista' && styles.layoutBtnAtivo]}
                    onPress={() => setLayoutPortfolio('lista')}
                  >
                    <Ionicons
                      name="list-outline"
                      size={16}
                      color={layoutPortfolio === 'lista' ? '#fff' : '#64748B'}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.btnEditarPortfolio} onPress={() => abrirEdicaoPortfolio()}>
                  <Ionicons name="create-outline" size={16} color="#EC1B4B" />
                  <Text style={styles.btnEditarPortfolioTexto}>Editar portfólio</Text>
                </TouchableOpacity>
              </View>
            )}

            {layoutPortfolio === 'lista' ? (
              <View style={styles.portfolioLista}>
                {agente.portfolio.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.portfolioListaItem}
                    onPress={() => isOwnProfile && abrirEdicaoPortfolio(item.id)}
                    activeOpacity={isOwnProfile ? 0.7 : 1}
                  >
                    <Image source={{ uri: item.imageUrl }} style={styles.portfolioListaImagem} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.portfolioListaTitulo}>{item.titulo || 'Sem título'}</Text>
                      {!!item.descricao && (
                        <Text style={styles.portfolioListaDescricao} numberOfLines={2}>
                          {item.descricao}
                        </Text>
                      )}
                    </View>
                    {isOwnProfile && <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />}
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.portfolioGrid}>
                {agente.portfolio.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => isOwnProfile && abrirEdicaoPortfolio(item.id)}
                    activeOpacity={isOwnProfile ? 0.7 : 1}
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={[
                        styles.portfolioItem,
                        layoutPortfolio === 'grid2' && styles.portfolioItem2col,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.avaliacoesContainer}>
            {/* Resumo de nota */}
            <View style={styles.resumoNota}>
              <Text style={styles.notaGrande}>{agente.notaMedia}</Text>
              <View>
                <Estrelas nota={agente.notaMedia} tamanho={18} />
                <Text style={styles.totalAvaliacoesTexto}>{agente.totalAvaliacoes} avaliações</Text>
              </View>
            </View>

            {agente.avaliacoes.map((item) => (
              <CardAvaliacao key={item.id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F7FA',
  },
  headerAcoes: {
    flexDirection: 'row',
    gap: 8,
  },
  btnVoltar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#EC1B4B',
  },
  badgeOnline: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff',
  },
  btnEditarFoto: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  nome: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  especialidade: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
    marginBottom: 8,
  },
  localRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  localTexto: {
    fontSize: 13,
    color: '#64748B',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumero: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  secao: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  secaoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  bioTexto: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  botoesRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  btnChat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EC1B4B',
    backgroundColor: '#fff',
  },
  btnChatTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EC1B4B',
  },
  btnAgendar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EC1B4B',
  },
  btnAgendarTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  btnEditarPerfilFull: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EC1B4B',
  },
  abasRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  abaAtiva: {
    backgroundColor: '#EC1B4B',
  },
  abaTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  abaTextoAtivo: {
    color: '#fff',
  },
  portfolioToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  layoutSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 3,
    gap: 2,
  },
  layoutBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layoutBtnAtivo: {
    backgroundColor: '#EC1B4B',
  },
  btnEditarPortfolio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  btnEditarPortfolioTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EC1B4B',
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  portfolioItem: {
    width: PORTFOLIO_ITEM_SIZE_3COL,
    height: PORTFOLIO_ITEM_SIZE_3COL,
    borderRadius: 12,
  },
  portfolioItem2col: {
    width: PORTFOLIO_ITEM_SIZE_2COL,
    height: PORTFOLIO_ITEM_SIZE_2COL,
    borderRadius: 16,
  },
  portfolioLista: {
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  portfolioListaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
  },
  portfolioListaImagem: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  portfolioListaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  portfolioListaDescricao: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  avaliacoesContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  resumoNota: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  notaGrande: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111',
  },
  totalAvaliacoesTexto: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardAvaliacao: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  avaliacaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  avatarAvaliador: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nomeAvaliador: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  dataAvaliacao: {
    fontSize: 12,
    color: '#94A3B8',
  },
  comentario: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
});
