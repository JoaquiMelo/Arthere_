import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import type { AgenteCriativo } from '@/features/agents/types/agent';
import { useChat } from '@/providers/chat-provider';
import { colors } from '@/shared/theme/colors';
import { AgentProfileCard } from '../../../features/agents/components/agent-profile-card';
import { CATEGORIAS } from '../../../shared/config/categories';

const REGIAO_INICIAL: Region = {
  latitude: -23.96,
  longitude: -46.34,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

const agentesBaixadaSantista: AgenteCriativo[] = [
  {
    id: '1',
    nome: 'Marina Oliveira',
    categoria: 'fotografo',
    disponivel: true,
    avaliacao: 4.9,
    cidade: 'Santos, SP',
    especialidades: ['Fotógrafo'],
    latitude: -23.9608,
    longitude: -46.3339,
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    descricao: 'Fotógrafa de eventos e retratos autorais.',
    portfolio: [{ id: 'marina-1', titulo: 'Retrato editorial', imagemUrl: 'https://picsum.photos/seed/marina-1/300/200' }],
  },
  {
    id: '2',
    nome: 'João Paulo',
    categoria: 'videomaker',
    disponivel: true,
    avaliacao: 4.7,
    cidade: 'São Vicente, SP',
    especialidades: ['Videomaker'],
    latitude: -23.965,
    longitude: -46.38,
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    descricao: 'Videomaker para campanhas, eventos e conteúdo digital.',
    portfolio: [{ id: 'joao-1', titulo: 'Vídeo de campanha', imagemUrl: 'https://picsum.photos/seed/joao-1/300/200' }],
  },
  {
    id: '3',
    nome: 'Beatriz Costa',
    categoria: 'dj',
    disponivel: false,
    avaliacao: 4.8,
    cidade: 'Guarujá, SP',
    especialidades: ['DJ'],
    latitude: -23.99,
    longitude: -46.26,
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    descricao: 'DJ para casamentos, festas e eventos corporativos.',
    portfolio: [{ id: 'beatriz-1', titulo: 'Evento ao vivo', imagemUrl: 'https://picsum.photos/seed/beatriz-1/300/200' }],
  },
  {
    id: '4',
    nome: 'Rafael Souza',
    categoria: 'artesao',
    disponivel: true,
    avaliacao: 4.6,
    cidade: 'Praia Grande, SP',
    especialidades: ['Artesanato'],
    latitude: -24.005,
    longitude: -46.41,
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
    descricao: 'Artesão de peças autorais em madeira para casas e eventos.',
    portfolio: [{ id: 'rafael-1', titulo: 'Coleção em madeira', imagemUrl: 'https://picsum.photos/seed/rafael-1/300/200' }],
  },
];

function CustomPin({
  agente,
  ativo,
  onPress,
}: {
  agente: AgenteCriativo;
  ativo: boolean;
  onPress: (a: AgenteCriativo) => void;
}) {
  const cor = CATEGORIAS[agente.categoria]?.cor ?? CATEGORIAS.design.cor;

  return (
    <Marker
      coordinate={{ latitude: agente.latitude, longitude: agente.longitude }}
      onPress={() => onPress(agente)}
      anchor={{ x: 0.5, y: 1 }}
    >
      <View style={[styles.pinContainer, ativo && styles.pinActive]}>
        <View style={[styles.pinImageContainer, { borderColor: cor }]}>
          <Image source={{ uri: agente.avatarUrl }} style={styles.pinImage} />
        </View>
        <View style={[styles.pinStatus, { backgroundColor: agente.disponivel ? cor : colors.muted }]} />
        <View style={[styles.pinTail, { borderTopColor: cor }]} />
      </View>
    </Marker>
  );
}

export function MapScreen() {
  const navigation = useNavigation<any>();
  const { startConversation } = useChat();
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<AgenteCriativo | null>(null);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return agentesBaixadaSantista.filter((agente) => {
      const categoriaOk = !categoria || agente.categoria === categoria;
      const categoriaLabel = CATEGORIAS[agente.categoria]?.label.toLowerCase() ?? '';
      const termoOk =
        !termo ||
        agente.nome.toLowerCase().includes(termo) ||
        agente.cidade.toLowerCase().includes(termo) ||
        categoriaLabel.includes(termo) ||
        agente.especialidades.some((item) => item.toLowerCase().includes(termo));

      return categoriaOk && termoOk;
    });
  }, [busca, categoria]);

  const destaque = [...filtrados].sort((a, b) => b.avaliacao - a.avaliacao).slice(0, 3);

  const abrirChat = (agente: AgenteCriativo) => {
    const conversationId = startConversation(agente);
    setSelecionado(null);
    navigation.navigate('ChatConversation', { conversationId });
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.posterHero}>
          <View style={styles.posterBlue} />
          <View style={styles.posterYellow} />
          <View style={styles.posterOrange} />
          <View style={styles.posterRed} />
          <View style={styles.posterCloudA}>
            <View style={styles.cloudLine} />
            <View style={[styles.cloudLine, styles.cloudLine2]} />
            <View style={[styles.cloudLine, styles.cloudLine3]} />
          </View>

          <View style={styles.heroTop}>
            <Text style={styles.micro}>ENCONTRO · TERRITÓRIO · CRIAÇÃO</Text>
            <Text style={styles.menu} onPress={() => navigation.navigate('Profile')}>●</Text>
          </View>

          <Text style={styles.brand}>Arthere</Text>
          <Text style={styles.heroStatement}>
            Onde a cidade{'
'}encontra quem{'
'}faz.
          </Text>

          <View style={styles.heroUnderline}>
            <View style={styles.underlineRed} />
            <View style={styles.underlineYellow} />
          </View>

          <Text style={styles.heroCopy}>
            Descubra talentos, projetos e encontros criativos pela Baixada Santista.
          </Text>

          <View style={styles.heroNumbers}>
            <View>
              <Text style={styles.heroNumber}>{agentesBaixadaSantista.length}</Text>
              <Text style={styles.heroNumberLabel}>TALENTOS</Text>
            </View>
            <View style={styles.heroNumberLine} />
            <View>
              <Text style={styles.heroNumber}>{Object.keys(CATEGORIAS).length}</Text>
              <Text style={styles.heroNumberLabel}>LINGUAGENS</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchSection}>
          <Text style={styles.sectionEyebrow}>01 · ENCONTRE</Text>
          <Text style={styles.sectionTitle}>Quem está por perto?</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.brandInk} />
            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="nome, cidade ou especialidade"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
            />
            {busca ? (
              <Ionicons name="close-circle" size={19} color={colors.brandTerracotta} onPress={() => setBusca('')} />
            ) : null}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <FilterChip label="Tudo" active={!categoria} onPress={() => setCategoria(null)} />
            {Object.entries(CATEGORIAS).map(([id, item]) => (
              <FilterChip
                key={id}
                label={item.label}
                dot={item.cor}
                active={categoria === id}
                onPress={() => setCategoria(categoria === id ? null : id)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.mapSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>02 · TERRITÓRIO</Text>
              <Text style={styles.sectionTitle}>A cidade é o estúdio.</Text>
            </View>
            <Text style={styles.mapCount}>{filtrados.length} NO MAPA</Text>
          </View>

          <View style={styles.mapFrame}>
            <MapView
              style={StyleSheet.absoluteFill}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              initialRegion={REGIAO_INICIAL}
              scrollEnabled
            >
              {filtrados.map((agente) => (
                <CustomPin
                  key={agente.id}
                  agente={agente}
                  ativo={selecionado?.id === agente.id}
                  onPress={setSelecionado}
                />
              ))}
            </MapView>

            <View style={styles.mapStamp}>
              <Text style={styles.mapStampText}>BAIXADA{'
'}SANTISTA</Text>
            </View>
          </View>

          {selecionado ? (
            <View style={styles.profileOverlay}>
              <AgentProfileCard
                agente={selecionado}
                visible
                onClose={() => setSelecionado(null)}
                onAgendar={(agente) => {
                  setSelecionado(null);
                  Alert.alert(`Solicitação de agenda para ${agente.nome}`);
                }}
                onChat={abrirChat}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.featured}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>03 · GENTE</Text>
              <Text style={styles.sectionTitle}>Feito por pessoas.</Text>
            </View>
            <Text style={styles.sideNote}>DESLIZE · DESCUBRA</Text>
          </View>

          {destaque.length === 0 ? (
            <Text style={styles.empty}>Nenhum artista encontrado com esses filtros.</Text>
          ) : (
            destaque.map((agente, index) => (
              <View
                key={agente.id}
                style={[
                  styles.card,
                  index % 2 === 0 ? styles.cardTiltLeft : styles.cardTiltRight,
                ]}
              >
                <Image source={{ uri: agente.avatarUrl }} style={styles.cardImage} />
                <View style={styles.cardColorBar} />
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardCategory}>
                      {CATEGORIAS[agente.categoria]?.label.toUpperCase() ?? 'CRIATIVO'}
                    </Text>
                    <Text style={styles.rating}>★ {agente.avaliacao.toFixed(1)}</Text>
                  </View>
                  <Text style={styles.cardName}>{agente.nome}</Text>
                  <Text style={styles.cardCity}>{agente.cidade}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {agente.descricao}
                  </Text>
                  <Text style={styles.cardAction} onPress={() => setSelecionado(agente)}>
                    VER NO MAPA ↗
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.invite}>
          <View style={styles.inviteBlob} />
          <Text style={styles.inviteEyebrow}>VOCÊ TAMBÉM FAZ PARTE DISSO</Text>
          <Text style={styles.inviteTitle}>Tem um trabalho{'
'}para mostrar?</Text>
          <Text style={styles.inviteCopy}>Crie seu perfil e deixe a cidade encontrar o que você faz.</Text>
          <Text style={styles.inviteButton} onPress={() => navigation.navigate('Register')}>
            CRIAR MEU PERFIL →
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Arthere</Text>
          <Text style={styles.footerText}>ARTE · ENCONTRO · TERRITÓRIO</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function FilterChip({
  label,
  active,
  dot,
  onPress,
}: {
  label: string;
  active: boolean;
  dot?: string;
  onPress: () => void;
}) {
  return (
    <Text
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
    >
      {dot ? <Text style={{ color: dot }}>● </Text> : null}
      {label.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.brandPaper },
  content: { paddingBottom: 0 },

  posterHero: {
    minHeight: 555,
    backgroundColor: colors.brandInk,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 34,
    overflow: 'hidden',
    position: 'relative',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
  },
  micro: {
    color: colors.brandSand,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 2,
  },
  menu: {
    color: colors.brandPaper,
    fontSize: 20,
  },
  brand: {
    color: colors.brandPaper,
    fontSize: 57,
    lineHeight: 62,
    fontWeight: '900',
    letterSpacing: -2.8,
    marginTop: 38,
    zIndex: 3,
  },
  heroStatement: {
    color: colors.brandPaper,
    fontSize: 41,
    lineHeight: 41,
    fontWeight: '900',
    letterSpacing: -1.5,
    marginTop: 27,
    zIndex: 3,
  },
  heroUnderline: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 17,
    zIndex: 3,
  },
  underlineRed: {
    width: 75,
    height: 8,
    borderRadius: 9,
    backgroundColor: colors.brandCoral,
    transform: [{ rotate: '-2deg' }],
  },
  underlineYellow: {
    width: 32,
    height: 8,
    borderRadius: 9,
    backgroundColor: colors.brandSand,
    transform: [{ rotate: '3deg' }],
  },
  heroCopy: {
    color: colors.brandPaper,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.92,
    maxWidth: 285,
    marginTop: 21,
    zIndex: 3,
  },
  heroNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 19,
    marginTop: 29,
    zIndex: 3,
  },
  heroNumber: {
    color: colors.brandSand,
    fontSize: 27,
    fontWeight: '900',
  },
  heroNumberLabel: {
    color: colors.brandPaper,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 1,
  },
  heroNumberLine: {
    width: 1,
    height: 32,
    backgroundColor: colors.brandPaper,
    opacity: 0.3,
  },
  posterBlue: {
    position: 'absolute',
    width: 165,
    height: 150,
    borderRadius: 80,
    backgroundColor: colors.brandBlue,
    right: -70,
    top: -35,
    transform: [{ rotate: '12deg' }],
  },
  posterYellow: {
    position: 'absolute',
    width: 100,
    height: 64,
    borderRadius: 50,
    backgroundColor: colors.brandSand,
    right: 12,
    top: 102,
    transform: [{ rotate: '-8deg' }],
  },
  posterOrange: {
    position: 'absolute',
    width: 48,
    height: 164,
    borderRadius: 24,
    backgroundColor: colors.brandTerracotta,
    right: 83,
    top: 63,
    transform: [{ rotate: '7deg' }],
  },
  posterRed: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.brandCoral,
    left: -27,
    bottom: 72,
  },
  posterCloudA: {
    position: 'absolute',
    width: 190,
    height: 76,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.brandSand,
    right: -74,
    bottom: 58,
    transform: [{ rotate: '-7deg' }],
    opacity: 0.9,
  },
  cloudLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 20,
    borderTopWidth: 3,
    borderTopColor: colors.brandSand,
    borderRadius: 50,
    transform: [{ rotate: '2deg' }],
  },
  cloudLine2: { top: 31, transform: [{ rotate: '-2deg' }] },
  cloudLine3: { top: 42, transform: [{ rotate: '1deg' }] },

  searchSection: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    backgroundColor: colors.brandPaper,
  },
  sectionEyebrow: {
    color: colors.brandTerracotta,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  sectionTitle: {
    color: colors.brandInk,
    fontSize: 29,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginTop: 7,
  },
  searchBox: {
    minHeight: 55,
    marginTop: 20,
    borderWidth: 2,
    borderColor: colors.brandInk,
    borderRadius: 28,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  searchInput: {
    flex: 1,
    color: colors.brandInk,
    fontSize: 13,
    paddingVertical: 8,
  },
  chips: {
    paddingTop: 13,
    paddingRight: 24,
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  chipActive: {
    color: colors.brandPaper,
    backgroundColor: colors.brandInk,
    borderColor: colors.brandInk,
  },
  chipInactive: {
    color: colors.brandInk,
    backgroundColor: colors.brandPaper,
    borderColor: colors.brandInk,
  },

  mapSection: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 38,
    backgroundColor: colors.surface,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 17,
  },
  mapCount: {
    color: colors.brandInk,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 3,
  },
  mapFrame: {
    height: 390,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.muted,
    borderWidth: 2,
    borderColor: colors.brandInk,
    borderRadius: 32,
    position: 'relative',
  },
  mapStamp: {
    position: 'absolute',
    left: 15,
    bottom: 15,
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.brandSand,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-9deg' }],
  },
  mapStampText: {
    color: colors.brandInk,
    textAlign: 'center',
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  profileOverlay: { marginTop: -210, marginHorizontal: 10, zIndex: 5 },

  featured: {
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 44,
    backgroundColor: colors.brandPaper,
  },
  sideNote: {
    color: colors.muted,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 3,
  },
  card: {
    borderWidth: 2,
    borderColor: colors.brandInk,
    backgroundColor: colors.white,
    borderRadius: 27,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  cardTiltLeft: { transform: [{ rotate: '-1deg' }] },
  cardTiltRight: { transform: [{ rotate: '1deg' }] },
  cardImage: {
    width: '100%',
    height: 205,
    backgroundColor: colors.muted,
  },
  cardColorBar: {
    height: 7,
    backgroundColor: colors.brandCoral,
  },
  cardBody: { padding: 17 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCategory: {
    color: colors.brandTerracotta,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  rating: {
    color: colors.brandInk,
    fontSize: 10,
    fontWeight: '900',
  },
  cardName: {
    color: colors.brandInk,
    fontSize: 27,
    lineHeight: 30,
    fontWeight: '900',
    marginTop: 7,
  },
  cardCity: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
  cardDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 11,
  },
  cardAction: {
    alignSelf: 'flex-start',
    color: colors.brandInk,
    backgroundColor: colors.brandSand,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 9,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 15,
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 35,
    fontSize: 13,
  },

  invite: {
    minHeight: 315,
    backgroundColor: colors.brandInk,
    paddingHorizontal: 24,
    paddingTop: 37,
    paddingBottom: 35,
    overflow: 'hidden',
    position: 'relative',
  },
  inviteBlob: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.brandBlue,
    right: -75,
    top: -55,
  },
  inviteEyebrow: {
    color: colors.brandSand,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  inviteTitle: {
    color: colors.brandPaper,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '900',
    marginTop: 18,
  },
  inviteCopy: {
    color: colors.brandPaper,
    opacity: 0.82,
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 290,
    marginTop: 14,
  },
  inviteButton: {
    alignSelf: 'flex-start',
    color: colors.brandInk,
    backgroundColor: colors.brandSand,
    borderRadius: 23,
    paddingHorizontal: 17,
    paddingVertical: 12,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginTop: 22,
  },
  footer: {
    backgroundColor: colors.brandInk,
    borderTopWidth: 1,
    borderTopColor: 'rgba(248,244,234,0.25)',
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 6,
  },
  footerBrand: {
    color: colors.brandPaper,
    fontSize: 25,
    fontWeight: '900',
  },
  footerText: {
    color: colors.brandSand,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.6,
  },

  pinContainer: { alignItems: 'center', width: 54, height: 65 },
  pinActive: { transform: [{ scale: 1.16 }] },
  pinImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    backgroundColor: colors.brandPaper,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
  },
  pinImage: { width: 40, height: 40, borderRadius: 20, alignSelf: 'center', marginTop: 2 },
  pinStatus: {
    position: 'absolute',
    right: 2,
    top: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.brandPaper,
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});
