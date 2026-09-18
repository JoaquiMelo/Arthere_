import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
// Requer o pacote expo-image-picker (já comum em projetos Expo).
// Se ainda não estiver instalado: npx expo install expo-image-picker
import * as ImagePicker from 'expo-image-picker';
import type { PortfolioItem } from './profile-screen';

export default function PortfolioCreationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const portfolioInicial: PortfolioItem[] = route.params?.portfolio ?? [];
  const focarItemId: string | undefined = route.params?.focarItemId;

  const [itens, setItens] = useState<PortfolioItem[]>(portfolioInicial);
  const [novaImagemUri, setNovaImagemUri] = useState<string | null>(null);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    // Se veio de um toque em um item específico da grade, apenas garante que
    // ele já está visível na lista abaixo — a rolagem até o card fica a
    // critério da integração final (ex: scrollTo com onLayout).
  }, [focarItemId]);

  const escolherNovaImagem = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para adicionar fotos ao portfólio.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!resultado.canceled && resultado.assets?.length) {
      setNovaImagemUri(resultado.assets[0].uri);
    }
  };

  const adicionarItem = () => {
    if (!novaImagemUri) {
      Alert.alert('Escolha uma imagem', 'Selecione uma foto para adicionar ao portfólio.');
      return;
    }

    const novoItem: PortfolioItem = {
      id: `novo-${Date.now()}`,
      imageUrl: novaImagemUri,
      titulo: novoTitulo.trim() || undefined,
      descricao: novaDescricao.trim() || undefined,
    };

    setItens((atual) => [novoItem, ...atual]);
    setNovaImagemUri(null);
    setNovoTitulo('');
    setNovaDescricao('');
  };

  const atualizarItem = (id: string, campo: 'titulo' | 'descricao', valor: string) => {
    setItens((atual) =>
      atual.map((item) => (item.id === id ? { ...item, [campo]: valor } : item))
    );
  };

  const trocarImagemItem = async (id: string) => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para trocar a foto.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!resultado.canceled && resultado.assets?.length) {
      const novaUri = resultado.assets[0].uri;
      setItens((atual) => atual.map((item) => (item.id === id ? { ...item, imageUrl: novaUri } : item)));
    }
  };

  const removerItem = (id: string) => {
    Alert.alert('Remover item', 'Tem certeza que deseja remover este item do portfólio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => setItens((atual) => atual.filter((item) => item.id !== id)),
      },
    ]);
  };

  const moverItem = (index: number, direcao: -1 | 1) => {
    setItens((atual) => {
      const novoIndex = index + direcao;
      if (novoIndex < 0 || novoIndex >= atual.length) return atual;
      const copia = [...atual];
      [copia[index], copia[novoIndex]] = [copia[novoIndex], copia[index]];
      return copia;
    });
  };

  const salvarPortfolio = async () => {
    setSalvando(true);
    try {
      // TODO: integrar com o serviço de API centralizado do Arthere, ex:
      // await apiService.atualizarPortfolio(agenteId, itens);
      await new Promise((resolve) => setTimeout(resolve, 600));

      navigation.navigate('Profile', { portfolioAtualizado: itens });
    } catch {
      Alert.alert('Erro ao salvar', 'Não foi possível salvar o portfólio. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnIcone} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Criação de Portfólio</Text>
        <TouchableOpacity style={styles.btnSalvar} onPress={salvarPortfolio} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.btnSalvarTexto}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* ── Adicionar novo item ─────────────────────────── */}
          <View style={styles.novoItemCard}>
            <Text style={styles.secaoTitulo}>Novo item</Text>

            <TouchableOpacity style={styles.areaImagem} onPress={escolherNovaImagem}>
              {novaImagemUri ? (
                <Image source={{ uri: novaImagemUri }} style={styles.imagemPreview} />
              ) : (
                <View style={styles.areaImagemVazia}>
                  <Ionicons name="image-outline" size={28} color="#94A3B8" />
                  <Text style={styles.areaImagemTexto}>Toque para escolher uma foto</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              value={novoTitulo}
              onChangeText={setNovoTitulo}
              placeholder="Título (opcional)"
              placeholderTextColor="#94A3B8"
            />
            <TextInput
              style={[styles.input, styles.inputMultilinha]}
              value={novaDescricao}
              onChangeText={setNovaDescricao}
              placeholder="Descrição (opcional)"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.btnAdicionar} onPress={adicionarItem}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.btnAdicionarTexto}>Adicionar ao portfólio</Text>
            </TouchableOpacity>
          </View>

          {/* ── Itens existentes ─────────────────────────────── */}
          <Text style={styles.listaTitulo}>Itens do portfólio ({itens.length})</Text>

          {itens.length === 0 ? (
            <Text style={styles.vazioTexto}>Você ainda não adicionou nenhum item.</Text>
          ) : (
            <View style={styles.lista}>
              {itens.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.itemCard,
                    focarItemId === item.id && styles.itemCardFocado,
                  ]}
                >
                  <TouchableOpacity onPress={() => trocarImagemItem(item.id)}>
                    <Image source={{ uri: item.imageUrl }} style={styles.itemImagem} />
                    <View style={styles.itemImagemOverlay}>
                      <Ionicons name="camera-outline" size={14} color="#fff" />
                    </View>
                  </TouchableOpacity>

                  <View style={styles.itemCampos}>
                    <TextInput
                      style={styles.itemInput}
                      value={item.titulo ?? ''}
                      onChangeText={(valor) => atualizarItem(item.id, 'titulo', valor)}
                      placeholder="Título"
                      placeholderTextColor="#94A3B8"
                    />
                    <TextInput
                      style={[styles.itemInput, styles.itemInputDescricao]}
                      value={item.descricao ?? ''}
                      onChangeText={(valor) => atualizarItem(item.id, 'descricao', valor)}
                      placeholder="Descrição"
                      placeholderTextColor="#94A3B8"
                      multiline
                    />
                  </View>

                  <View style={styles.itemAcoes}>
                    <TouchableOpacity
                      style={styles.itemAcaoBtn}
                      onPress={() => moverItem(index, -1)}
                      disabled={index === 0}
                    >
                      <Ionicons name="chevron-up" size={16} color={index === 0 ? '#CBD5E1' : '#475569'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.itemAcaoBtn}
                      onPress={() => moverItem(index, 1)}
                      disabled={index === itens.length - 1}
                    >
                      <Ionicons
                        name="chevron-down"
                        size={16}
                        color={index === itens.length - 1 ? '#CBD5E1' : '#475569'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemAcaoBtn} onPress={() => removerItem(item.id)}>
                      <Ionicons name="trash-outline" size={16} color="#EC1B4B" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  btnIcone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  btnSalvar: {
    minWidth: 72,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EC1B4B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  btnSalvarTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  novoItemCard: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },
  areaImagem: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  areaImagemVazia: {
    height: 140,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  areaImagemTexto: {
    fontSize: 12,
    color: '#94A3B8',
  },
  imagemPreview: {
    width: '100%',
    height: 140,
    borderRadius: 16,
  },
  input: {
    backgroundColor: '#F8F7FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111',
    marginBottom: 10,
  },
  inputMultilinha: {
    minHeight: 70,
  },
  btnAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
  },
  btnAdicionarTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  listaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  vazioTexto: {
    fontSize: 13,
    color: '#94A3B8',
    marginHorizontal: 16,
  },
  lista: {
    paddingHorizontal: 16,
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
  },
  itemCardFocado: {
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  itemImagem: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  itemImagemOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(17,17,17,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCampos: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  itemInput: {
    backgroundColor: '#F8F7FA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#111',
  },
  itemInputDescricao: {
    minHeight: 40,
  },
  itemAcoes: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemAcaoBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
