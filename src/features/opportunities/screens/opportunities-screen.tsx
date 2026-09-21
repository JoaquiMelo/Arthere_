import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { candidatarProjeto, criarProjeto, listarProjetos, obterSessao, Projeto } from '@/services/api';
import { colors } from '@/shared/theme/colors';

export default function OpportunitiesScreen() {
  const navigation = useNavigation<any>();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [tipo, setTipo] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [orcamento, setOrcamento] = useState('');

  const carregar = async () => {
    try {
      setCarregando(true);
      const [lista, sessao] = await Promise.all([listarProjetos(), obterSessao()]);
      setProjetos(lista);
      setTipo(sessao?.usuario.tipo ?? null);
    } catch (error) {
      Alert.alert('Não foi possível carregar', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { void carregar(); }, 0);
    return () => clearTimeout(timer);
  }, []);

  const candidatar = async (projeto: Projeto) => {
    try {
      await candidatarProjeto(projeto.id);
      Alert.alert('Candidatura enviada!', 'O contratante poderá analisar seu perfil.');
    } catch (error) {
      Alert.alert('Não foi possível candidatar-se', error instanceof Error ? error.message : 'Tente novamente.');
    }
  };

  const publicar = async () => {
    if (!titulo.trim() || !descricao.trim() || !categoria.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha título, descrição e categoria.');
      return;
    }
    try {
      await criarProjeto({ titulo, descricao, categoria, orcamento: orcamento ? Number(orcamento.replace(',', '.')) : undefined });
      setModalAberto(false);
      setTitulo(''); setDescricao(''); setCategoria(''); setOrcamento('');
      await carregar();
      Alert.alert('Oportunidade publicada!');
    } catch (error) {
      Alert.alert('Não foi possível publicar', error instanceof Error ? error.message : 'Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View><Text style={styles.title}>Oportunidades</Text><Text style={styles.subtitle}>Encontre ou publique trabalhos</Text></View>
        {tipo === 'CONTRATANTE' && (
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.manage} onPress={() => navigation.navigate('ManageOpportunities')} accessibilityLabel="Gerenciar candidaturas"><Ionicons name="people-outline" color={colors.primaryDark} size={20} /></TouchableOpacity>
            <TouchableOpacity style={styles.add} onPress={() => setModalAberto(true)}><Ionicons name="add" color={colors.white} size={24} /></TouchableOpacity>
          </View>
        )}
      </View>
      {carregando ? <ActivityIndicator style={styles.loader} color={colors.primaryDark} /> : (
        <FlatList data={projetos} onRefresh={carregar} refreshing={carregando} keyExtractor={(item) => item.id} contentContainerStyle={projetos.length ? styles.list : styles.empty} ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma oportunidade aberta no momento.</Text>} renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.category}>{item.categoria}</Text><Text style={styles.projectTitle}>{item.titulo}</Text>
            <Text style={styles.description}>{item.descricao}</Text><Text style={styles.company}>{item.contratante.empresa || item.contratante.nome}</Text>
            <View style={styles.footer}>{item.orcamento != null && <Text style={styles.budget}>R$ {item.orcamento.toFixed(2)}</Text>}{tipo === 'AGENTE' && <TouchableOpacity style={styles.apply} onPress={() => candidatar(item)}><Text style={styles.applyText}>Candidatar-me</Text></TouchableOpacity>}</View>
          </View>
        )} />
      )}
      <Modal visible={modalAberto} animationType="slide" transparent onRequestClose={() => setModalAberto(false)}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
          <View style={styles.modal}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Nova oportunidade</Text>
              <Text style={styles.fieldLabel}>Título da vaga *</Text>
              <TextInput style={styles.input} placeholder="Ex.: Fotógrafo para evento corporativo" placeholderTextColor="#94A3B8" value={titulo} onChangeText={setTitulo} />
              <Text style={styles.fieldLabel}>Descrição *</Text>
              <TextInput style={[styles.input, styles.textarea]} placeholder="Descreva o serviço, requisitos e o que espera do profissional." placeholderTextColor="#94A3B8" value={descricao} onChangeText={setDescricao} multiline />
              <Text style={styles.fieldLabel}>Categoria *</Text>
              <TextInput style={styles.input} placeholder="Ex.: Fotografia, Música, Design..." placeholderTextColor="#94A3B8" value={categoria} onChangeText={setCategoria} />
              <Text style={styles.fieldLabel}>Orçamento</Text>
              <TextInput style={styles.input} placeholder="Ex.: 1500,00 (opcional)" placeholderTextColor="#94A3B8" value={orcamento} onChangeText={setOrcamento} keyboardType="decimal-pad" />
              <View style={styles.actions}><TouchableOpacity onPress={() => setModalAberto(false)}><Text style={styles.cancel}>Cancelar</Text></TouchableOpacity><TouchableOpacity style={styles.publish} onPress={publicar}><Text style={styles.publishText}>Publicar</Text></TouchableOpacity></View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, header: { paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, title: { fontSize: 22, fontWeight: '800', color: colors.text }, subtitle: { color: colors.muted, marginTop: 3 }, headerActions: { flexDirection: 'row', gap: 10 }, manage: { backgroundColor: colors.surfaceStrong, width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' }, add: { backgroundColor: colors.primaryDark, width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' }, loader: { flex: 1 }, list: { padding: 16, paddingTop: 0, gap: 12 }, empty: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' }, emptyText: { color: colors.muted }, card: { backgroundColor: colors.white, borderRadius: 18, padding: 16, shadowColor: '#000', shadowOpacity: .05, shadowRadius: 8, elevation: 1 }, category: { color: colors.primary, fontWeight: '700', fontSize: 12, textTransform: 'uppercase' }, projectTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 5 }, description: { color: colors.text, lineHeight: 20, marginTop: 8 }, company: { color: colors.muted, marginTop: 10, fontSize: 13 }, footer: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, budget: { color: colors.primaryDark, fontWeight: '700' }, apply: { backgroundColor: colors.primaryDark, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 }, applyText: { color: colors.white, fontWeight: '700' }, overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,.35)', justifyContent: 'flex-end' }, modal: { backgroundColor: colors.white, padding: 22, paddingBottom: 30, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' }, modalTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 18 }, fieldLabel: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 12 }, input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 13, color: colors.text }, textarea: { minHeight: 100, textAlignVertical: 'top' }, actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 20, marginTop: 24 }, cancel: { color: colors.muted, fontWeight: '700' }, publish: { backgroundColor: colors.primaryDark, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 }, publishText: { color: colors.white, fontWeight: '800' },
});
