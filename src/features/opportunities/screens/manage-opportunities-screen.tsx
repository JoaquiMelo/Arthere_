import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { Candidato, VagaGerenciada } from '../../../features/opportunities/screens/types/management';
import { ReviewFormModal } from '@/features/reviews/components/review-form-modal';
import { StarRating } from '../../../features/reviews/components/star-rating';
import { useManagement } from '@/providers/management-provider';
import { useReviews } from '@/providers/reviews-provider';
import { colors } from '@/shared/theme/colors';

const STATUS_LABEL: Record<VagaGerenciada['status'], string> = { ABERTA: 'Aberta', EM_ANDAMENTO: 'Em andamento', CONCLUIDA: 'Concluída' };
const STATUS_COR: Record<VagaGerenciada['status'], string> = { ABERTA: colors.primary, EM_ANDAMENTO: colors.accent, CONCLUIDA: colors.muted };

export default function ManageOpportunitiesScreen() {
  const navigation = useNavigation<any>();
  const { vagas, aceitarCandidato, recusarCandidato, concluirVaga, marcarAvaliado } = useManagement();
  const { adicionarAvaliacao } = useReviews();
  const [expandida, setExpandida] = useState<string | null>(null);
  const [avaliando, setAvaliando] = useState<{ vagaId: string; candidato: Candidato } | null>(null);

  const responder = (vaga: VagaGerenciada, candidato: Candidato, status: 'ACEITA' | 'RECUSADA') => {
    if (status === 'ACEITA') {
      Alert.alert('Aceitar candidato', `Confirmar ${candidato.nome} para "${vaga.titulo}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aceitar', onPress: () => aceitarCandidato(vaga.id, candidato.id) },
      ]);
    } else {
      recusarCandidato(vaga.id, candidato.id);
    }
  };

  const concluir = (vaga: VagaGerenciada) => {
    Alert.alert('Concluir projeto', 'Marcar este projeto como concluído?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Concluir', onPress: () => concluirVaga(vaga.id) },
    ]);
  };

  const abrirAvaliacao = (vaga: VagaGerenciada) => {
    const contratado = vaga.candidatos.find((item) => item.status === 'ACEITA');
    if (!contratado) return;
    setAvaliando({ vagaId: vaga.id, candidato: contratado });
  };

  const enviarAvaliacao = ({ nota, comentario }: { nota: number; comentario: string }) => {
    if (!avaliando) return;
    adicionarAvaliacao({ agenteId: avaliando.candidato.agenteId, autorNome: 'Você', nota, comentario });
    marcarAvaliado(avaliando.vagaId);
    const nome = avaliando.candidato.nome;
    setAvaliando(null);
    Alert.alert('Avaliação enviada!', `Obrigado por avaliar ${nome}.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()} accessibilityLabel="Voltar"><Ionicons name="chevron-back" size={25} color={colors.text} /></TouchableOpacity>
        <Text style={styles.title}>Minhas vagas</Text>
        <View style={styles.headerSpacer} />
      </View>
      <FlatList
        data={vagas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não publicou vagas.</Text>}
        renderItem={({ item: vaga }) => {
          const aberta = expandida === vaga.id;
          const contratado = vaga.candidatos.find((c) => c.status === 'ACEITA');
          return (
            <View style={styles.card}>
              <TouchableOpacity style={styles.cardHeader} onPress={() => setExpandida(aberta ? null : vaga.id)} activeOpacity={0.75}>
                <View style={styles.flex1}>
                  <Text style={styles.category}>{vaga.categoria}</Text>
                  <Text style={styles.vagaTitulo}>{vaga.titulo}</Text>
                  <Text style={styles.candidatosCount}>{vaga.candidatos.length} candidato{vaga.candidatos.length === 1 ? '' : 's'}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: STATUS_COR[vaga.status] }]}><Text style={styles.badgeText}>{STATUS_LABEL[vaga.status]}</Text></View>
                <Ionicons name={aberta ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
              </TouchableOpacity>

              {aberta && (
                <View style={styles.candidatos}>
                  {vaga.candidatos.length === 0 && <Text style={styles.emptyText}>Nenhuma candidatura recebida ainda.</Text>}
                  {vaga.candidatos.map((candidato) => (
                    <View key={candidato.id} style={styles.candidatoCard}>
                      <Image source={{ uri: candidato.avatarUrl }} style={styles.avatar} />
                      <View style={styles.flex1}>
                        <View style={styles.candidatoTop}><Text style={styles.candidatoNome}>{candidato.nome}</Text><StarRating value={candidato.avaliacao} size={12} /></View>
                        <Text style={styles.candidatoEspecialidade}>{candidato.especialidade}</Text>
                        <Text style={styles.candidatoMensagem}>{candidato.mensagem}</Text>
                        {candidato.status === 'PENDENTE' ? (
                          <View style={styles.candidatoActions}>
                            <TouchableOpacity style={styles.recusar} onPress={() => responder(vaga, candidato, 'RECUSADA')}><Text style={styles.recusarText}>Recusar</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.aceitar} onPress={() => responder(vaga, candidato, 'ACEITA')}><Text style={styles.aceitarText}>Aceitar</Text></TouchableOpacity>
                          </View>
                        ) : (
                          <Text style={[styles.statusCandidato, candidato.status === 'ACEITA' ? styles.statusAceito : styles.statusRecusado]}>
                            {candidato.status === 'ACEITA' ? '✓ Contratado' : 'Recusado'}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}

                  {vaga.status === 'EM_ANDAMENTO' && contratado && (
                    <TouchableOpacity style={styles.concluir} onPress={() => concluir(vaga)}><Text style={styles.concluirText}>Concluir projeto</Text></TouchableOpacity>
                  )}
                  {vaga.status === 'CONCLUIDA' && contratado && !vaga.avaliado && (
                    <TouchableOpacity style={styles.avaliar} onPress={() => abrirAvaliacao(vaga)}><Ionicons name="star" size={16} color={colors.white} /><Text style={styles.avaliarText}>Avaliar {contratado.nome}</Text></TouchableOpacity>
                  )}
                  {vaga.status === 'CONCLUIDA' && vaga.avaliado && <Text style={styles.avaliadoText}>Você já avaliou este profissional.</Text>}
                </View>
              )}
            </View>
          );
        }}
      />
      <ReviewFormModal visible={!!avaliando} agenteNome={avaliando?.candidato.nome ?? ''} onClose={() => setAvaliando(null)} onSubmit={enviarAvaliacao} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  back: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }, title: { color: colors.text, fontSize: 17, fontWeight: '800' }, headerSpacer: { width: 38 },
  list: { padding: 16, paddingTop: 6, gap: 12 }, emptyText: { color: colors.muted, textAlign: 'center', marginTop: 20 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 14, shadowColor: '#000', shadowOpacity: .05, shadowRadius: 8, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 }, flex1: { flex: 1 },
  category: { color: colors.primary, fontWeight: '700', fontSize: 11, textTransform: 'uppercase' }, vagaTitulo: { color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 3 }, candidatosCount: { color: colors.muted, fontSize: 12, marginTop: 4 },
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 }, badgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  candidatos: { marginTop: 14, gap: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14 },
  candidatoCard: { flexDirection: 'row', gap: 10, backgroundColor: colors.surface, borderRadius: 12, padding: 11 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  candidatoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, candidatoNome: { color: colors.text, fontWeight: '800', fontSize: 13 }, candidatoEspecialidade: { color: colors.muted, fontSize: 11, marginTop: 2 }, candidatoMensagem: { color: colors.text, fontSize: 12, lineHeight: 17, marginTop: 6 },
  candidatoActions: { flexDirection: 'row', gap: 8, marginTop: 10 }, recusar: { flex: 1, height: 36, borderRadius: 9, borderWidth: 1, borderColor: colors.danger, alignItems: 'center', justifyContent: 'center' }, recusarText: { color: colors.danger, fontWeight: '700', fontSize: 12 }, aceitar: { flex: 1, height: 36, borderRadius: 9, backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center' }, aceitarText: { color: colors.white, fontWeight: '700', fontSize: 12 },
  statusCandidato: { marginTop: 8, fontSize: 12, fontWeight: '700' }, statusAceito: { color: colors.primaryDark }, statusRecusado: { color: colors.muted },
  concluir: { marginTop: 4, height: 42, borderRadius: 10, backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center' }, concluirText: { color: colors.white, fontWeight: '800', fontSize: 13 },
  avaliar: { marginTop: 4, height: 42, borderRadius: 10, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, avaliarText: { color: colors.white, fontWeight: '800', fontSize: 13 },
  avaliadoText: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 4 },
});
