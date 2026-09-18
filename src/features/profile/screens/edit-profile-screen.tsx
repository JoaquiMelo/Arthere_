import React, { useState } from 'react';
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
import type { AgentePerfil } from './profile-screen';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const agenteAtual: AgentePerfil | undefined = route.params?.agente;

  const [avatarUri, setAvatarUri] = useState(agenteAtual?.avatarUrl ?? '');
  const [nome, setNome] = useState(agenteAtual?.nome ?? '');
  const [especialidade, setEspecialidade] = useState(agenteAtual?.especialidade ?? '');
  const [cidade, setCidade] = useState(agenteAtual?.cidade ?? '');
  const [bio, setBio] = useState(agenteAtual?.bio ?? '');
  const [salvando, setSalvando] = useState(false);

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para trocar sua foto de perfil.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets?.length) {
      setAvatarUri(resultado.assets[0].uri);
    }
  };

  const salvar = async () => {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'Informe seu nome para continuar.');
      return;
    }

    setSalvando(true);
    try {
      // TODO: integrar com o serviço de API centralizado do Arthere, ex:
      // await apiService.atualizarPerfil(agenteAtual.id, { nome, especialidade, cidade, bio, avatarUri });
      await new Promise((resolve) => setTimeout(resolve, 600));

      navigation.navigate('Profile', {
        perfilAtualizado: {
          ...agenteAtual,
          nome: nome.trim(),
          especialidade: especialidade.trim(),
          cidade: cidade.trim(),
          bio: bio.trim(),
          avatarUrl: avatarUri,
        },
      });
    } catch {
      Alert.alert('Erro ao salvar', 'Não foi possível atualizar seu perfil. Tente novamente.');
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
        <Text style={styles.headerTitulo}>Editar Perfil</Text>
        <TouchableOpacity style={styles.btnSalvar} onPress={salvar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.btnSalvarTexto}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Avatar */}
          <View style={styles.avatarSecao}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={escolherFoto}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={36} color="#94A3B8" />
                </View>
              )}
              <View style={styles.btnCamera}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={escolherFoto}>
              <Text style={styles.trocarFotoTexto}>Trocar foto</Text>
            </TouchableOpacity>
          </View>

          {/* Campos */}
          <View style={styles.campo}>
            <Text style={styles.rotulo}>Nome</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome completo"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.rotulo}>Especialidade</Text>
            <TextInput
              style={styles.input}
              value={especialidade}
              onChangeText={setEspecialidade}
              placeholder="Ex: Fotógrafo & Videomaker"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.rotulo}>Cidade</Text>
            <TextInput
              style={styles.input}
              value={cidade}
              onChangeText={setCidade}
              placeholder="Ex: São Paulo, SP"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.rotulo}>Bio</Text>
            <TextInput
              style={[styles.input, styles.inputMultilinha]}
              value={bio}
              onChangeText={setBio}
              placeholder="Conte um pouco sobre seu trabalho..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={280}
            />
            <Text style={styles.contador}>{bio.length}/280</Text>
          </View>
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
    fontSize: 17,
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
  avatarSecao: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#EC1B4B',
  },
  avatarPlaceholder: {
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCamera: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  trocarFotoTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EC1B4B',
  },
  campo: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#111',
  },
  inputMultilinha: {
    minHeight: 110,
  },
  contador: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
});
