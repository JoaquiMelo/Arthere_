import React, { useMemo, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { AgenteCriativo } from '../types/agents';
import { mockAgentes } from '../data/mockAgents';
import { AgentMarker } from '../../../components/AgenteMaker';
import { AgentProfileCard } from '../../../components/AgentProfileCards';

const REGIAO_INICIAL: Region = {
  latitude: -23.5550,
  longitude: -46.6700,
  latitudeDelta: 0.045,
  longitudeDelta: 0.045,
};

export function MapScreen() {
  const [busca, setBusca] = useState('');
  const [agenteSelecionado, setAgenteSelecionado] = useState<AgenteCriativo | null>(null);
  const [cardVisivel, setCardVisivel] = useState(false);

  const agentesFiltrados = useMemo(() => {
    if (!busca.trim()) return mockAgentes;
    const termo = busca.toLowerCase();
    return mockAgentes.filter(
      (a) => a.nome.toLowerCase().includes(termo) || a.cidade.toLowerCase().includes(termo)
    );
  }, [busca]);

  function abrirPerfil(agente: AgenteCriativo) {
    setAgenteSelecionado(agente);
    setCardVisivel(true);
  }

  function fecharPerfil() {
    setCardVisivel(false);
  }

  return (
    <View style={styles.container}>
      {/* Mapa de Fundo */}
      <MapView
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={REGIAO_INICIAL}
      >
        {agentesFiltrados.map((agente) => (
          <AgentMarker key={agente.id} agente={agente} onPress={abrirPerfil} />
        ))}
      </MapView>

      {/* Barra de Busca Superior */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar artistas, cidades, ca"
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Indicador de quantidade de agentes */}
      <View style={styles.badge}>
        <Text style={styles.badgeTexto}>{agentesFiltrados.length} agentes</Text>
      </View>

      {/* Barra de Navegação Inferior (Tab Bar) - Idêntica à imagem */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="settings-outline" size={22} color="#64748B" />
          <Text style={styles.tabText}>Ajustes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.activeTabCircle}>
            <Ionicons name="location-sharp" size={22} color="#fff" />
          </View>
          <Text style={[styles.tabText, styles.tabTextActive]}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="briefcase-outline" size={22} color="#64748B" />
          <Text style={styles.tabText}>Vagas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person-outline" size={22} color="#64748B" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="mail-outline" size={22} color="#64748B" />
          <Text style={styles.tabText}>Mensagens</Text>
        </TouchableOpacity>
      </View>

      {/* Card de Detalhes */}
      <AgentProfileCard
        agente={agenteSelecionado}
        visible={cardVisivel}
        onClose={fecharPerfil}
        onAgendar={(agente) => {
          fecharPerfil();
          alert(`Agendando com ${agente.nome}`);
        }}
        onChat={(agente) => {
          fecharPerfil();
          alert(`Iniciando chat com ${agente.nome}`);
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
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  menuButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111',
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: 112,
    alignSelf: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    zIndex: 10,
  },
  badgeTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  /* Tab Bar Inferior Customizada */
  bottomTabBar: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    height: 74,
    backgroundColor: '#fff',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    paddingHorizontal: 8,
    zIndex: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeTabCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EC1B4B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  tabTextActive: {
    color: '#EC1B4B',
    fontWeight: '700',
  },
});