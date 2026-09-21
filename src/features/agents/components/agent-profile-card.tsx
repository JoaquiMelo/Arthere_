import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CATEGORIAS } from '../../../shared/config/categories';
import type { AgenteCriativo } from '@/features/agents/types/agent';
import { StarRating } from '../../reviews/components/star-rating';
import { useReviews } from '../../../providers/reviews-provider';
import { colors } from '@/shared/theme/colors';

interface Props {
  agente: AgenteCriativo | null;
  visible: boolean;
  onClose: () => void;
  onAgendar: (agente: AgenteCriativo) => void;
  onChat: (agente: AgenteCriativo) => void;
}

export function AgentProfileCard({ agente, visible, onClose, onAgendar, onChat }: Props) {
  // Hooks precisam rodar sempre na mesma ordem, então ficam antes do retorno condicional abaixo.
  const { avaliacoesPorAgente, mediaPorAgente } = useReviews();

  if (!agente) return null;
  // Dados externos podem trazer uma categoria ainda não cadastrada. Nesse caso,
  // exibimos Design para que o modal continue renderizando.
  const categoria = CATEGORIAS[agente.categoria] ?? CATEGORIAS.design; 
  const avaliacao = typeof agente.avaliacao === 'number' ? agente.avaliacao : 0;
  const avaliacoes = avaliacoesPorAgente(agente.id);
  const media = avaliacoes.length ? mediaPorAgente(agente.id) : avaliacao;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={20} color={colors.muted} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Image source={{ uri: agente.avatarUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.nome}>{agente.nome}</Text>
            <View style={styles.categoriaRow}>
              <MaterialCommunityIcons name={categoria.icone as never} size={14} color={categoria.cor} />
              <Text style={[styles.categoriaTexto, { color: categoria.cor }]}>{categoria.label}</Text>
            </View>
            {agente.disponivel && <Text style={styles.disponivel}>Disponível</Text>}
          </View>
        </View>
        <Text style={styles.meta}>★ {media.toFixed(1)} ({avaliacoes.length}) · {agente.cidade}</Text>
        <Text style={styles.descricao}>{agente.descricao}</Text>
        <Text style={styles.titulo}>PORTFÓLIO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {agente.portfolio.map((item) => (
            <View key={item.id} style={styles.portfolioItem}>
              {item.imagemUrl ? <Image source={{ uri: item.imagemUrl }} style={styles.portfolioImagem} /> : <View style={styles.placeholder} />}
              <Text style={styles.portfolioTexto}>{item.titulo}</Text>
            </View>
          ))}
        </ScrollView>
        {avaliacoes.length > 0 && (
          <>
            <Text style={styles.titulo}>AVALIAÇÕES</Text>
            {avaliacoes.slice(0, 2).map((item) => (
              <View key={item.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}><Text style={styles.reviewAutor}>{item.autorNome}</Text><StarRating value={item.nota} size={12} /></View>
                {item.comentario && <Text style={styles.reviewTexto} numberOfLines={2}>{item.comentario}</Text>}
              </View>
            ))}
            {avaliacoes.length > 2 && <Text style={styles.reviewMais}>+{avaliacoes.length - 2} avaliações</Text>}
          </>
        )}
        <View style={styles.acoes}>
          <TouchableOpacity style={styles.agendar} onPress={() => onAgendar(agente)}><Text style={styles.agendarTexto}>Agendar</Text></TouchableOpacity>
          <TouchableOpacity style={styles.chat} onPress={() => onChat(agente)}><Ionicons name="chatbubble-outline" size={20} color={colors.primaryDark} /></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32 },
  closeButton: { position: 'absolute', top: 14, right: 14, zIndex: 1, padding: 8 },
  header: { flexDirection: 'row', gap: 12 }, avatar: { width: 56, height: 56, borderRadius: 28 }, nome: { fontSize: 16, fontWeight: '700', color: colors.text },
  categoriaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }, categoriaTexto: { fontSize: 13, fontWeight: '600' }, disponivel: { color: colors.primary, fontSize: 11, fontWeight: '600', marginTop: 4 },
  meta: { fontSize: 12, color: colors.muted, marginTop: 16 }, descricao: { fontSize: 13, color: colors.text, lineHeight: 19, marginTop: 12 }, titulo: { fontSize: 11, color: colors.muted, fontWeight: '600', letterSpacing: 0.5, marginTop: 18, marginBottom: 8 },
  portfolioItem: { width: 90, marginRight: 10 }, portfolioImagem: { width: 90, height: 70, borderRadius: 10 }, placeholder: { width: 90, height: 70, borderRadius: 10, backgroundColor: colors.surface }, portfolioTexto: { fontSize: 11, color: colors.muted, marginTop: 4 },
  acoes: { flexDirection: 'row', marginTop: 20 }, agendar: { flex: 1, backgroundColor: colors.primaryDark, borderRadius: 14, height: 48, alignItems: 'center', justifyContent: 'center' }, agendarTexto: { color: colors.white, fontWeight: '700' }, chat: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  reviewItem: { backgroundColor: colors.surface, borderRadius: 10, padding: 10, marginBottom: 8 }, reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, reviewAutor: { color: colors.text, fontWeight: '700', fontSize: 12 }, reviewTexto: { color: colors.text, fontSize: 12, lineHeight: 16, marginTop: 4 }, reviewMais: { color: colors.primaryDark, fontSize: 12, fontWeight: '700' },
});
