import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { AgentProfileCard } from '../../../features/agents/components/agent-profile-card';
import type { AgenteCriativo } from '@/features/agents/types/agent';
import { CATEGORIAS } from '../../../shared/config/categories';
import { colors } from '@/shared/theme/colors';
import { useChat } from '@/providers/chat-provider';

const REGIAO_INICIAL: Region = {
  latitude: -23.9608,
  longitude: -46.3339,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
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
    portfolio: [
      {
        id: 'marina-1',
        titulo: 'Retrato editorial',
        imagemUrl: 'https://picsum.photos/seed/marina-1/300/200',
      },
    ],
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
    portfolio: [
      {
        id: 'joao-1',
        titulo: 'Vídeo de campanha',
        imagemUrl: 'https://picsum.photos/seed/joao-1/300/200',
      },
    ],
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
    portfolio: [
      {
        id: 'beatriz-1',
        titulo: 'Evento ao vivo',
        imagemUrl: 'https://picsum.photos/seed/beatriz-1/300/200',
      },
    ],
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
    portfolio: [
      {
        id: 'rafael-1',
        titulo: 'Coleção em madeira',
        imagemUrl: 'https://picsum.photos/seed/rafael-1/300/200',
      },
    ],
  },
];

const CustomPin = ({
  agente,
  onPress,
}: {
  agente: AgenteCriativo;
  onPress: (a: AgenteCriativo) => void;
}) => {
  const corBorda = CATEGORIAS[agente.categoria]?.cor ?? CATEGORIAS.design.cor;

  return (
    <Marker
      coordinate={{ latitude: agente.latitude, longitude: agente.longitude }}
      onPress={() => onPress(agente)}
      anchor={{ x: 0.5, y: 1 }}
    >
      <View style={styles.pinContainer}>
        <View style={[styles.pinImageContainer, { borderColor: corBorda }]}>
          <Image source={{ uri: agente.avatarUrl }} style={styles.pinImage} />
        </View>
        <View style={[styles.pinTail, { borderTopColor: corBorda }]} />
      </View>
    </Marker>
  );
};

export function MapScreen() {
  const navigation = useNavigation<any>();
  const { startConversation } = useChat();
  const [busca, setBusca] = useState('');
  const [agenteSelecionado, setAgenteSelecionado] = useState<AgenteCriativo | null>(null);

  const agentesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return termo
      ? agentesBaixadaSantista.filter((agente) => {
          const categoria = CATEGORIAS[agente.categoria]?.label.toLowerCase() ?? '';
          return (
            agente.nome.toLowerCase().includes(termo) ||
            agente.cidade.toLowerCase().includes(termo) ||
            categoria.includes(termo)
          );
        })
      : agentesBaixadaSantista;
  }, [busca]);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={REGIAO_INICIAL}
      >
        {agentesFiltrados.map((agente) => (
          <CustomPin key={agente.id} agente={agente} onPress={setAgenteSelecionado} />
        ))}
      </MapView>

      <View style={styles.topBar}>
        <Text style={styles.kicker}>MAPA CRIATIVO · BAIXADA SANTISTA</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.brandInk} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar artista ou cidade"
            placeholderTextColor={colors.muted}
            value={busca}
            onChangeText={setBusca}
          />
        </View>
      </View>

      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeTexto}>
          {agentesFiltrados.length} {agentesFiltrados.length === 1 ? 'ARTISTA' : 'ARTISTAS'}
        </Text>
      </View>

      <AgentProfileCard
        agente={agenteSelecionado}
        visible={agenteSelecionado !== null}
        onClose={() => setAgenteSelecionado(null)}
        onAgendar={(agente) => {
          setAgenteSelecionado(null);
          Alert.alert(`Agendando com ${agente.nome}`);
        }}
        onChat={(agente) => {
          const conversationId = startConversation(agente);
          setAgenteSelecionado(null);
          navigation.navigate('ChatConversation', { conversationId });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 18 : 12,
    left: 14,
    right: 14,
  },
  kicker: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brandInk,
    color: colors.brandSand,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.25,
    marginBottom: 7,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingHorizontal: 14,
    backgroundColor: colors.brandPaper,
    borderWidth: 1,
    borderColor: colors.brandInk,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 9,
    color: colors.brandInk,
    fontSize: 14,
    paddingVertical: 12,
  },
  badge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 142 : 133,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.brandPaper,
    borderWidth: 1,
    borderColor: colors.brandInk,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.brandCoral,
  },
  badgeTexto: {
    color: colors.brandInk,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  pinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 62,
  },
  pinImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    backgroundColor: colors.brandPaper,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 4,
  },
  pinImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  pinTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
});
