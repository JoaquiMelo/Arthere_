import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { AgentProfileCard } from '../../../features/agents/components/agent-profile-card';
import type { AgenteCriativo } from '@/features/agents/types/agent';
import { CATEGORIAS } from '../../../shared/config/categories';
import { colors } from '@/shared/theme/colors';
import { useChat } from '@/providers/chat-provider';

// 1. Centralizando a região inicial na Baixada Santista (Santos, SP)
const REGIAO_INICIAL: Region = { 
  latitude: -23.9608, 
  longitude: -46.3339, 
  latitudeDelta: 0.1, 
  longitudeDelta: 0.1 
};

// 2. Mock de 4 agentes
const agentesBaixadaSantista: AgenteCriativo[] = [
  {
    id: '1', nome: 'Marina Oliveira', categoria: 'fotografo', disponivel: true, avaliacao: 4.9,
    cidade: 'Santos, SP', especialidades: ['Fotógrafo'], latitude: -23.9608, longitude: -46.3339,
    avatarUrl: 'https://i.pravatar.cc/150?img=47', descricao: 'Fotógrafa de eventos e retratos autorais.',
    portfolio: [{ id: 'marina-1', titulo: 'Retrato editorial', imagemUrl: 'https://picsum.photos/seed/marina-1/300/200' }],
  },
  {
    id: '2', nome: 'João Paulo', categoria: 'videomaker', disponivel: true, avaliacao: 4.7,
    cidade: 'São Vicente, SP', especialidades: ['Videomaker'], latitude: -23.9650, longitude: -46.3800,
    avatarUrl: 'https://i.pravatar.cc/150?img=12', descricao: 'Videomaker para campanhas, eventos e conteúdo digital.',
    portfolio: [{ id: 'joao-1', titulo: 'Vídeo de campanha', imagemUrl: 'https://picsum.photos/seed/joao-1/300/200' }],
  },
  {
    id: '3', nome: 'Beatriz Costa', categoria: 'dj', disponivel: false, avaliacao: 4.8,
    cidade: 'Guarujá, SP', especialidades: ['DJ'], latitude: -23.9900, longitude: -46.2600,
    avatarUrl: 'https://i.pravatar.cc/150?img=25', descricao: 'DJ para casamentos, festas e eventos corporativos.',
    portfolio: [{ id: 'beatriz-1', titulo: 'Evento ao vivo', imagemUrl: 'https://picsum.photos/seed/beatriz-1/300/200' }],
  },
  {
    id: '4', nome: 'Rafael Souza', categoria: 'artesao', disponivel: true, avaliacao: 4.6,
    cidade: 'Praia Grande, SP', especialidades: ['Artesanato'], latitude: -24.0050, longitude: -46.4100,
    avatarUrl: 'https://i.pravatar.cc/150?img=33', descricao: 'Artesão de peças autorais em madeira para casas e eventos.',
    portfolio: [{ id: 'rafael-1', titulo: 'Coleção em madeira', imagemUrl: 'https://picsum.photos/seed/rafael-1/300/200' }],
  },
];

// 3. Componente do Pin customizado no estilo da image_0a1fc3.png
const CustomPin = ({ agente, onPress }: { agente: AgenteCriativo, onPress: (a: AgenteCriativo) => void }) => {
  const corBorda = CATEGORIAS[agente.categoria]?.cor ?? CATEGORIAS.design.cor;
  
  return (
    <Marker 
      coordinate={{ latitude: agente.latitude, longitude: agente.longitude }} 
      onPress={() => onPress(agente)}
      anchor={{ x: 0.5, y: 1 }}
    >
      <View style={styles.pinContainer}>
        {/* Círculo com a imagem e borda */}
        <View style={[styles.pinImageContainer, { borderColor: corBorda }]}>
          <Image source={{ uri: agente.avatarUrl }} style={styles.pinImage} />
        </View>
        {/* Triângulo (setinha do pin) apontando para baixo */}
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
          return agente.nome.toLowerCase().includes(termo) || agente.cidade.toLowerCase().includes(termo) || categoria.includes(termo);
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
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Buscar artistas ou cidades" 
            placeholderTextColor={colors.muted}
            value={busca} 
            onChangeText={setBusca} 
          />
        </View>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeTexto}>{agentesFiltrados.length} agentes</Text>
      </View>

      <AgentProfileCard 
        agente={agenteSelecionado} 
        visible={agenteSelecionado !== null} 
        onClose={() => setAgenteSelecionado(null)} 
        onAgendar={(agente) => { setAgenteSelecionado(null); Alert.alert(`Agendando com ${agente.nome}`); }} 
        onChat={(agente) => { const conversationId = startConversation(agente); setAgenteSelecionado(null); navigation.navigate('ChatConversation', { conversationId }); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { position: 'absolute', top: 50, left: 16, right: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', height: 46, paddingHorizontal: 14, borderRadius: 14, backgroundColor: colors.white, elevation: 3 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.text },
  badge: { position: 'absolute', top: 112, alignSelf: 'center', backgroundColor: colors.primaryDark, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6 },
  badgeTexto: { color: colors.white, fontWeight: '700', fontSize: 13 },
  
  // Estilos do Pin customizado
  pinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 60,
  },
  pinImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    backgroundColor: colors.white,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
