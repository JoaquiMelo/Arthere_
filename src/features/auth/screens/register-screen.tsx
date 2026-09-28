import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '@/providers/user-provider';

type TipoUsuario = 'AGENTE' | 'CONTRATANTE';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { updateProfile } = useUser();
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>('AGENTE');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }
    if (tipoUsuario === 'CONTRATANTE' && !empresa.trim()) {
      Alert.alert('Atenção', 'Informe o nome da empresa ou organização.');
      return;
    }
    try {
      setCarregando(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      updateProfile({ nome, email, tipo: tipoUsuario, empresa });
      navigation.navigate(tipoUsuario === 'AGENTE' ? 'CreatePortfolio' : 'CustomizeProfile');
    } catch {
      Alert.alert('Erro', 'Não foi possível concluir o cadastro.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.visualHeader}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>ENCONTRO · TERRITÓRIO</Text>
            <Text style={styles.brand}>Arthere</Text>
            <View style={styles.brandLine} />
            <Text style={styles.headerDescription}>Crie seu espaço na rede criativa{'
'}da Baixada Santista.</Text>
          </View>
          <View style={styles.shapeCoral} /><View style={styles.shapeYellow} /><View style={styles.shapeBlue} />
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Criar perfil</Text>
          <Text style={styles.subtitle}>Faça parte da cena criativa.</Text>

          <Text style={styles.label}>TIPO DE PERFIL</Text>
          <View style={styles.roles}>
            <TouchableOpacity style={[styles.role, tipoUsuario === 'AGENTE' && styles.roleActive]} onPress={() => setTipoUsuario('AGENTE')}>
              <Ionicons name="color-palette-outline" size={16} color={tipoUsuario === 'AGENTE' ? '#28232b' : '#77716d'} />
              <Text style={styles.roleTitle}>AGENTE CRIATIVO</Text>
              <Text style={styles.roleSub}>Artista / profissional</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.role, tipoUsuario === 'CONTRATANTE' && styles.roleActive]} onPress={() => setTipoUsuario('CONTRATANTE')}>
              <Ionicons name="briefcase-outline" size={16} color={tipoUsuario === 'CONTRATANTE' ? '#28232b' : '#77716d'} />
              <Text style={styles.roleTitle}>CONTRATANTE</Text>
              <Text style={styles.roleSub}>Empresa / organização</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>NOME</Text>
          <View style={styles.inputWrap}><Ionicons name="person-outline" size={15} color="#77716d" /><TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#77716d" value={nome} onChangeText={setNome} /></View>
          {tipoUsuario === 'CONTRATANTE' && <><Text style={styles.label}>EMPRESA</Text><View style={styles.inputWrap}><Ionicons name="business-outline" size={15} color="#77716d" /><TextInput style={styles.input} placeholder="Empresa ou organização" placeholderTextColor="#77716d" value={empresa} onChangeText={setEmpresa} /></View></>}
          <Text style={styles.label}>E-MAIL</Text>
          <View style={styles.inputWrap}><Ionicons name="mail-outline" size={15} color="#77716d" /><TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor="#77716d" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /></View>
          <Text style={styles.label}>SENHA</Text>
          <View style={styles.inputWrap}><Ionicons name="lock-closed-outline" size={15} color="#77716d" /><TextInput style={styles.input} placeholder="Digite sua senha" placeholderTextColor="#77716d" value={senha} onChangeText={setSenha} secureTextEntry /></View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={carregando}>
            {carregando ? <ActivityIndicator color="#f7f2e9" /> : <><Text style={styles.buttonText}>{tipoUsuario === 'AGENTE' ? 'CONTINUAR PARA PORTFÓLIO' : 'PERSONALIZAR PERFIL'}</Text><Ionicons name="arrow-forward" size={16} color="#f7f2e9" /></>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.registerRow}>
            <Text style={styles.registerText}>Já possui uma conta?</Text><Text style={styles.registerLink}>FAÇA LOGIN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f2e9' },
  scroll: { flexGrow: 1 },
  visualHeader: { height: 151, backgroundColor: '#28232b', overflow: 'hidden', position: 'relative' },
  back: { position: 'absolute', left: 12, top: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: '#0878df', borderWidth: 2, borderColor: '#8fd0ff', alignItems: 'center', justifyContent: 'center', zIndex: 5 },
  headerText: { marginLeft: 15, marginTop: 14, zIndex: 2 },
  eyebrow: { color: '#f2c75c', fontSize: 6.5, fontWeight: '900', letterSpacing: 1.1 },
  brand: { color: '#f7f2e9', fontSize: 31, lineHeight: 36, fontWeight: '900', letterSpacing: -1.3, marginTop: 3 },
  brandLine: { width: 53, height: 4, backgroundColor: '#f25b43', marginTop: 5, marginBottom: 10 },
  headerDescription: { color: '#f7f2e9', fontSize: 8.5, lineHeight: 13, opacity: 0.92 },
  shapeCoral: { position: 'absolute', right: 62, top: 0, width: 37, height: 76, backgroundColor: '#f25b43', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, transform: [{ rotate: '1deg' }] },
  shapeYellow: { position: 'absolute', right: -2, top: 20, width: 70, height: 34, backgroundColor: '#f2d28b', borderRadius: 7, transform: [{ rotate: '-4deg' }] },
  shapeBlue: { position: 'absolute', right: -7, bottom: -21, width: 62, height: 76, backgroundColor: '#8ac6d8', borderTopLeftRadius: 24, transform: [{ rotate: '20deg' }] },
  form: { paddingHorizontal: 15, paddingTop: 16, paddingBottom: 24 },
  title: { color: '#302a31', fontSize: 20, lineHeight: 23, fontWeight: '900', marginBottom: 2 },
  subtitle: { color: '#77716d', fontSize: 9, marginBottom: 14 },
  label: { color: '#514b4a', fontSize: 6.5, fontWeight: '900', letterSpacing: 1.3, marginBottom: 5, marginTop: 1 },
  roles: { flexDirection: 'row', gap: 7, marginBottom: 12 },
  role: { flex: 1, minHeight: 66, backgroundColor: '#fbf8f2', borderWidth: 1, borderColor: '#ddd7cf', padding: 8, justifyContent: 'center' },
  roleActive: { borderColor: '#28232b', backgroundColor: '#eee8dd' },
  roleTitle: { color: '#302a31', fontSize: 7, fontWeight: '900', letterSpacing: .7, marginTop: 4 },
  roleSub: { color: '#77716d', fontSize: 7, marginTop: 2 },
  inputWrap: { height: 32, backgroundColor: '#fbf8f2', borderWidth: 1, borderColor: '#ddd7cf', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginBottom: 10 },
  input: { flex: 1, color: '#302a31', fontSize: 9, marginLeft: 7, paddingVertical: 5 },
  button: { height: 32, backgroundColor: '#28232b', paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  buttonText: { color: '#f7f2e9', fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 14 },
  registerText: { color: '#77716d', fontSize: 8 },
  registerLink: { color: '#f25b43', fontSize: 7, fontWeight: '900', letterSpacing: 1 },
});