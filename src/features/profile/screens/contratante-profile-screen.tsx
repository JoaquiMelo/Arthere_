import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useManagement } from '@/providers/management-provider';
import { useUser } from '@/providers/user-provider';
import { colors } from '@/shared/theme/colors';

const AVATAR_PADRAO = 'https://i.pravatar.cc/300?img=68';

export default function ContratanteProfileScreen() {
  const navigation = useNavigation<any>();
  const { user } = useUser();
  const { vagas } = useManagement();
  const [empresa, setEmpresa] = useState('Empresa não informada');
  const [editando, setEditando] = useState(false);
  const [rascunhoEmpresa, setRascunhoEmpresa] = useState(empresa);

  const concluidas = vagas.filter((vaga) => vaga.status === 'CONCLUIDA').length;
  const emAndamento = vagas.filter((vaga) => vaga.status === 'EM_ANDAMENTO').length;
  const totalCandidaturas = vagas.reduce((soma, vaga) => soma + vaga.candidatos.length, 0);

  const abrirEdicao = () => { setRascunhoEmpresa(empresa); setEditando(true); };
  const salvarEmpresa = () => { setEmpresa(rascunhoEmpresa.trim() || empresa); setEditando(false); };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverContainer}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80' }} style={styles.coverImage} />
          <View style={styles.coverOverlay} />
          <TouchableOpacity style={styles.settingsIcon} onPress={() => navigation.navigate('Settings')} accessibilityLabel="Abrir configurações"><Ionicons name="settings-outline" size={21} color={colors.white} /></TouchableOpacity>
        </View>

        <View style={styles.intro}>
          <Image source={{ uri: AVATAR_PADRAO }} style={styles.avatar} />
          <Text style={styles.name}>{user.nomeSocial || user.nome}</Text>
          <TouchableOpacity style={styles.empresaRow} onPress={() => navigation.navigate('EditContractorProfile')}>
            <Ionicons name="business-outline" size={14} color={colors.orange} />
            <Text style={styles.empresa}>{empresa}</Text>
            <Ionicons name="pencil" size={12} color={colors.primaryDark} />
          </TouchableOpacity>
          <View style={styles.locationRow}><Ionicons name="location" size={14} color={colors.orange} /><Text style={styles.location}>{user.cidade}</Text></View>

          <View style={styles.statsRow}>
            <View style={styles.stat}><Text style={styles.statNumber}>{vagas.length}</Text><Text style={styles.statLabel}>vagas publicadas</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={styles.statNumber}>{emAndamento}</Text><Text style={styles.statLabel}>em andamento</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={styles.statNumber}>{concluidas}</Text><Text style={styles.statLabel}>concluídas</Text></View>
          </View>

          <TouchableOpacity style={styles.manageButton} onPress={() => navigation.navigate('ManageOpportunities')}>
            <Ionicons name="people-outline" size={17} color={colors.white} />
            <Text style={styles.manageButtonText}>Gerenciar candidaturas{totalCandidaturas > 0 ? ` (${totalCandidaturas})` : ''}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.vagasSection}>
          <Text style={styles.sectionTitle}>Minhas vagas</Text>
          {vagas.length === 0 && <Text style={styles.emptyText}>Você ainda não publicou nenhuma vaga.</Text>}
          {vagas.map((vaga) => (
            <TouchableOpacity key={vaga.id} style={styles.vagaCard} onPress={() => navigation.navigate('ManageOpportunities')} activeOpacity={0.75}>
              <View style={styles.flex1}>
                <Text style={styles.vagaTitulo}>{vaga.titulo}</Text>
                <Text style={styles.vagaMeta}>{vaga.categoria} · {vaga.candidatos.length} candidato{vaga.candidatos.length === 1 ? '' : 's'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={editando} animationType="fade" transparent onRequestClose={() => setEditando(false)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Nome da empresa</Text>
            <TextInput style={styles.editInput} value={rascunhoEmpresa} onChangeText={setRascunhoEmpresa} placeholder="Ex.: Vitrine Eventos" placeholderTextColor={colors.muted} />
            <View style={styles.editActions}>
              <TouchableOpacity onPress={() => setEditando(false)}><Text style={styles.cancel}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={salvarEmpresa}><Text style={styles.saveText}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, scrollContent: { paddingBottom: 42 },
  coverContainer: { height: 150, overflow: 'hidden', backgroundColor: colors.secondary }, coverImage: { width: '100%', height: '100%' }, coverOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(20,42,45,0.25)' },
  settingsIcon: { position: 'absolute', top: 14, right: 16, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.28)' },
  intro: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 }, avatar: { width: 100, height: 100, borderRadius: 50, marginTop: -50, borderWidth: 4, borderColor: colors.white },
  name: { marginTop: 11, color: colors.text, fontSize: 22, fontWeight: '800' },
  empresaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }, empresa: { color: colors.primaryDark, fontSize: 13, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }, location: { color: colors.muted, fontSize: 13 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 }, stat: { width: 96, alignItems: 'center' }, statNumber: { color: colors.text, fontSize: 18, fontWeight: '800' }, statLabel: { marginTop: 2, color: colors.muted, fontSize: 11, textAlign: 'center' }, statDivider: { width: StyleSheet.hairlineWidth, height: 27, backgroundColor: colors.border },
  manageButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, height: 46, borderRadius: 12, paddingHorizontal: 18, backgroundColor: colors.primaryDark }, manageButtonText: { color: colors.white, fontWeight: '800', fontSize: 13 },
  editProfileButton:{marginHorizontal:20,marginTop:4,height:46,borderRadius:12,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7,backgroundColor:colors.primaryDark},
  vagasSection: { paddingHorizontal: 20, paddingTop: 26, gap: 10 }, sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 4 }, emptyText: { color: colors.muted, fontSize: 13 },
  vagaCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: .05, shadowRadius: 8, elevation: 1 }, flex1: { flex: 1 }, vagaTitulo: { color: colors.text, fontWeight: '800', fontSize: 14 }, vagaMeta: { color: colors.muted, fontSize: 12, marginTop: 3 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,.35)', justifyContent: 'center', paddingHorizontal: 28 },
  editCard: { backgroundColor: colors.white, borderRadius: 18, padding: 20 }, editTitle: { color: colors.text, fontSize: 15, fontWeight: '800', marginBottom: 10 }, editInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 12, color: colors.text }, editActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 18, marginTop: 18 }, cancel: { color: colors.muted, fontWeight: '700' }, save: { backgroundColor: colors.primaryDark, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 }, saveText: { color: colors.white, fontWeight: '800' },
});
