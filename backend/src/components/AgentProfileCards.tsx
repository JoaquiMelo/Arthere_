import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AgenteCriativo } from '../scr/scr/types/agents';
import { CATEGORIAS } from '../scr/scr/constantes/categorias'

interface Props {
  agente: AgenteCriativo | null;
  visible: boolean;
  onClose: () => void;
  onAgendar: (agente: AgenteCriativo) => void;
  onChat: (agente: AgenteCriativo) => void;
}

export function AgentProfileCard({ agente, visible, onClose, onAgendar, onChat }: Props) {
  if (!agente) return null;
  const categoria = CATEGORIAS[agente.categoria];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <View style={styles.sheet}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={20} color="#666" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Image source={{ uri: agente.fotoUrl }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.nome}>{agente.nome}</Text>
            <View style={styles.categoriaRow}>
              <View style={[styles.categoriaIcone, { backgroundColor: categoria.cor }]}>
                <MaterialCommunityIcons name={categoria.icone as any} size={12} color="#fff" />
              </View>
              <Text style={[styles.categoriaTexto, { color: categoria.cor }]}>
                {categoria.label}
              </Text>
            </View>
            {agente.disponivel && (
              <View style={styles.disponivelBadge}>
                <View style={styles.disponivelDot} />
                <Text style={styles.disponivelTexto}>Disponível</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={14} color="#FBBF24" />
            <Text style={styles.metaTexto}>{agente.avaliacao.toFixed(1)} avaliação</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color="#888" />
            <Text style={styles.metaTexto}>{agente.cidade}</Text>
          </View>
        </View>

        <Text style={styles.descricao}>{agente.descricao}</Text>

        <Text style={styles.portfolioTitulo}>PORTFÓLIO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {agente.portfolio.map((item) => (
            <View key={item.id} style={styles.portfolioItem}>
              {item.imagemUrl ? (
                <Image source={{ uri: item.imagemUrl }} style={styles.portfolioImagem} />
              ) : (
                <View style={styles.portfolioPlaceholder} />
              )}
              <Text style={styles.portfolioTexto}>{item.titulo}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.acoes}>
          <TouchableOpacity style={styles.botaoAgendar} onPress={() => onAgendar(agente)}>
            <Ionicons name="calendar-outline" size={18} color="#fff" />
            <Text style={styles.botaoAgendarTexto}>Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoChat} onPress={() => onChat(agente)}>
            <Ionicons name="chatbubble-outline" size={20} color="#EC1B4B" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    marginTop: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  categoriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoriaIcone: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  categoriaTexto: {
    fontSize: 13,
    fontWeight: '600',
  },
  disponivelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  disponivelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  disponivelTexto: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaTexto: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  descricao: {
    fontSize: 13,
    color: '#333',
    lineHeight: 19,
    marginTop: 12,
  },
  portfolioTitulo: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 8,
  },
  portfolioItem: {
    width: 90,
    marginRight: 10,
  },
  portfolioImagem: {
    width: 90,
    height: 70,
    borderRadius: 10,
  },
  portfolioPlaceholder: {
    width: 90,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  portfolioTexto: {
    fontSize: 11,
    color: '#555',
    marginTop: 4,
  },
  acoes: {
    flexDirection: 'row',
    marginTop: 20,
  },
  botaoAgendar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EC1B4B',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoAgendarTexto: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
  },
  botaoChat: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});