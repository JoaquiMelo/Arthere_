import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '@/providers/user-provider';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Informe o e-mail e a senha.');
      return;
    }
    try {
      setCarregando(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (login) await login(email.trim(), senha);
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    } catch {
      Alert.alert('Erro', 'Não foi possível realizar o login.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.visualHeader}>
        <View style={styles.gear}><Ionicons name="settings-sharp" size={22} color="#fff" /></View>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>ENCONTRO · TERRITÓRIO</Text>
          <Text style={styles.brand}>Arthere</Text>
          <View style={styles.brandLine} />
          <Text style={styles.headerDescription}>Conectando talentos criativos e{'
'}projetos na Baixada Santista.</Text>
        </View>
        <View style={styles.shapeCoral} />
        <View style={styles.shapeYellow} />
        <View style={styles.shapeBlue} />
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Acesse seu espaço criativo.</Text>

        <Text style={styles.label}>E-MAIL</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={15} color="#77716d" />
          <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor="#77716d" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <Text style={styles.label}>SENHA</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={15} color="#77716d" />
          <TextInput style={styles.input} placeholder="Digite sua senha" placeholderTextColor="#77716d" value={senha} onChangeText={setSenha} secureTextEntry />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={carregando}>
          {carregando ? <ActivityIndicator color="#f7f2e9" /> : <><Text style={styles.buttonText}>ENTRAR</Text><Ionicons name="arrow-forward" size={16} color="#f7f2e9" /></>}
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Ainda não tem uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={styles.registerLink}>CRIAR PERFIL</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f2e9' },
  visualHeader: { height: 151, backgroundColor: '#28232b', overflow: 'hidden', position: 'relative' },
  headerText: { marginLeft: 15, marginTop: 14, zIndex: 2 },
  eyebrow: { color: '#f2c75c', fontSize: 6.5, fontWeight: '900', letterSpacing: 1.1 },
  brand: { color: '#f7f2e9', fontSize: 31, lineHeight: 36, fontWeight: '900', letterSpacing: -1.3, marginTop: 3 },
  brandLine: { width: 53, height: 4, backgroundColor: '#f25b43', marginTop: 5, marginBottom: 10 },
  headerDescription: { color: '#f7f2e9', fontSize: 8.5, lineHeight: 13, opacity: 0.92 },
  gear: { position: 'absolute', top: 9, left: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: '#0878df', borderWidth: 2, borderColor: '#8fd0ff', alignItems: 'center', justifyContent: 'center', zIndex: 5 },
  shapeCoral: { position: 'absolute', right: 62, top: 0, width: 37, height: 76, backgroundColor: '#f25b43', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, transform: [{ rotate: '1deg' }] },
  shapeYellow: { position: 'absolute', right: -2, top: 20, width: 70, height: 34, backgroundColor: '#f2d28b', borderRadius: 7, transform: [{ rotate: '-4deg' }] },
  shapeBlue: { position: 'absolute', right: -7, bottom: -21, width: 62, height: 76, backgroundColor: '#8ac6d8', borderTopLeftRadius: 24, transform: [{ rotate: '20deg' }] },
  form: { paddingHorizontal: 15, paddingTop: 16, flex: 1 },
  title: { color: '#302a31', fontSize: 20, lineHeight: 23, fontWeight: '900', marginBottom: 2 },
  subtitle: { color: '#77716d', fontSize: 9, marginBottom: 15 },
  label: { color: '#514b4a', fontSize: 6.5, fontWeight: '900', letterSpacing: 1.4, marginBottom: 5, marginTop: 1 },
  inputWrap: { height: 32, backgroundColor: '#fbf8f2', borderWidth: 1, borderColor: '#ddd7cf', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginBottom: 11 },
  input: { flex: 1, color: '#302a31', fontSize: 9, marginLeft: 7, paddingVertical: 5 },
  button: { height: 32, backgroundColor: '#28232b', paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 1 },
  buttonText: { color: '#f7f2e9', fontSize: 7, fontWeight: '900', letterSpacing: 1.4 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 14 },
  registerText: { color: '#77716d', fontSize: 8 },
  registerLink: { color: '#f25b43', fontSize: 7, fontWeight: '900', letterSpacing: 1 },
});