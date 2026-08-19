import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { AgentProfileCard } from '../components/AgentProfileCards';
import { AgentMarker } from '../components/AgenteMaker';
import { mockAgentes } from '../data/mockAgents';
import { AgenteCriativo } from '../types/agents';

const REGIAO_INICIAL: Region = { latitude: -23.555, longitude: -46.67, latitudeDelta: 0.045, longitudeDelta: 0.045 };

export function MapScreen() {
  const [busca, setBusca] = useState('');
  const [agenteSelecionado, setAgenteSelecionado] = useState<AgenteCriativo | null>(null);
  const agentesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return termo ? mockAgentes.filter((agente) => agente.nome.toLowerCase().includes(termo) || agente.cidade.toLowerCase().includes(termo)) : mockAgentes;
  }, [busca]);

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} initialRegion={REGIAO_INICIAL}>
        {agentesFiltrados.map((agente) => <AgentMarker key={agente.id} agente={agente} onPress={setAgenteSelecionado} />)}
      </MapView>
      <View style={styles.topBar}>
        <View style={styles.searchBox}><Ionicons name="search" size={18} color="#999" /><TextInput style={styles.searchInput} placeholder="Buscar artistas ou cidades" placeholderTextColor="#999" value={busca} onChangeText={setBusca} /></View>
      </View>
      <View style={styles.badge}><Text style={styles.badgeTexto}>{agentesFiltrados.length} agentes</Text></View>
      <AgentProfileCard agente={agenteSelecionado} visible={agenteSelecionado !== null} onClose={() => setAgenteSelecionado(null)} onAgendar={(agente) => { setAgenteSelecionado(null); Alert.alert(`Agendando com ${agente.nome}`); }} onChat={(agente) => { setAgenteSelecionado(null); Alert.alert(`Iniciando chat com ${agente.nome}`); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, topBar: { position: 'absolute', top: 50, left: 16, right: 16 }, searchBox: { flexDirection: 'row', alignItems: 'center', height: 46, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#fff', elevation: 3 }, searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#111' }, badge: { position: 'absolute', top: 112, alignSelf: 'center', backgroundColor: '#7C3AED', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6 }, badgeTexto: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
