import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/providers/theme-provider';
import { useUser } from '@/providers/user-provider';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { palette } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={[styles.miniHeader, { borderBottomColor: palette.border }]}>
        <View>
          <Text style={[styles.brand, { color: palette.brandInk }]}>ARTHERE</Text>
          <Text style={[styles.brandSub, { color: palette.muted }]}>ARTE · ENCONTRO · TERRITÓRIO</Text>
        </View>
        <Text style={[styles.headerLabel, { color: palette.muted }]}>ENTRAR</Text>
      </View>

      <View style={[styles.hero, { borderBottomColor: palette.border }]}>
        <Text style={[styles.kicker, { color: palette.muted }]}>SEU ESPAÇO CRIATIVO</Text>
        <Text style={[styles.heroTitle, { color: palette.brandInk }]}>Entre para fazer a</Text>
        <Text style={[styles.heroTitleAccent, { color: palette.brandCoral }]}>cena acontecer.</Text>
        <Text style={[styles.heroDescription, { color: palette.muted }]}>
          Acesse seus projetos, conexões e oportunidades na Baixada Santista.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: palette.muted }]}>E-MAIL</Text>
        <View style={[styles.inputContainer, { backgroundColor: palette.brandPaper, borderColor: palette.brandInk }]}>
          <Ionicons name="mail-outline" size={19} color={palette.brandInk} />
          <TextInput
            style={[styles.input, { color: palette.brandInk }]}
            placeholder="seu@email.com"
            placeholderTextColor={palette.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={[styles.label, { color: palette.muted }]}>SENHA</Text>
        <View style={[styles.inputContainer, { backgroundColor: palette.brandPaper, borderColor: palette.brandInk }]}>
          <Ionicons name="lock-closed-outline" size={19} color={palette.brandInk} />
          <TextInput
            style={[styles.input, { color: palette.brandInk }]}
            placeholder="Digite sua senha"
            placeholderTextColor={palette.muted}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: palette.brandInk }]} onPress={handleLogin} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color={palette.brandPaper} />
          ) : (
            <>
              <Text style={[styles.buttonText, { color: palette.brandPaper }]}>ENTRAR</Text>
              <Ionicons name="arrow-forward" size={17} color={palette.brandPaper} />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={[styles.registerText, { color: palette.muted }]}>Ainda não tem uma conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.registerLink, { color: palette.brandCoral }]}>CRIAR PERFIL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  miniHeader: {
    minHeight: 62,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { fontSize: 18, lineHeight: 20, fontWeight: '900', letterSpacing: 1.5 },
  brandSub: { fontSize: 7, fontWeight: '800', letterSpacing: 1.1, marginTop: 2 },
  headerLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.4 },
  hero: { paddingHorizontal: 20, paddingTop: 26, paddingBottom: 24, borderBottomWidth: 1 },
  kicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
  heroTitle: { fontSize: 31, lineHeight: 34, fontWeight: '600', letterSpacing: -0.8 },
  heroTitleAccent: { fontSize: 31, lineHeight: 34, fontWeight: '800', letterSpacing: -0.8 },
  heroDescription: { fontSize: 12, lineHeight: 18, marginTop: 10, maxWidth: 310 },
  form: { paddingHorizontal: 20, paddingTop: 24 },
  label: { fontSize: 9, fontWeight: '900', letterSpacing: 1.3, marginBottom: 7 },
  inputContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 13,
    marginBottom: 17,
  },
  input: { flex: 1, fontSize: 14, marginLeft: 10, paddingVertical: 12 },
  button: {
    height: 52,
    marginTop: 3,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: { fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginTop: 20 },
  registerText: { fontSize: 11 },
  registerLink: { fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
});
