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

import { useUser } from '@/providers/user-provider';
import { colors } from '@/shared/theme/colors';

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

      if (login) {
        await login(email.trim(), senha);
      }

      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    } catch {
      Alert.alert('Erro', 'Não foi possível realizar o login.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.page}>
        <View style={styles.hero}>
          <View style={styles.sun} />
          <View style={styles.wave} />
          <View style={styles.orangeBlob} />
          <View style={styles.blueBlob} />
          <View style={styles.heroInner}>
            <Text style={styles.kicker}>ARTE · ENCONTRO · TERRITÓRIO</Text>
            <Text style={styles.brand}>Arthere</Text>
            <View style={styles.dash}>
              <View style={styles.dashRed} />
              <View style={styles.dashYellow} />
            </View>
            <Text style={styles.heroText}>
              Um espaço para talentos criativos, projetos e encontros na Baixada Santista.
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.heading}>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>Volte para o seu espaço criativo.</Text>
          </View>

          <Text style={styles.label}>E-MAIL</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={19} color={colors.brandBlue} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>SENHA</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={19} color={colors.brandTerracotta} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor={colors.muted}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color={colors.brandPaper} />
            ) : (
              <>
                <Text style={styles.buttonText}>ENTRAR</Text>
                <View style={styles.buttonArrow}>
                  <Ionicons name="arrow-forward" size={17} color={colors.brandInk} />
                </View>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Ainda não tem uma conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>CRIAR PERFIL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandPaper,
  },
  page: {
    flex: 1,
  },
  hero: {
    minHeight: 282,
    backgroundColor: colors.brandInk,
    overflow: 'hidden',
    position: 'relative',
  },
  heroInner: {
    zIndex: 3,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 30,
  },
  kicker: {
    color: colors.brandSand,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  brand: {
    color: colors.brandPaper,
    fontSize: 57,
    lineHeight: 60,
    fontWeight: '900',
    letterSpacing: -2.5,
    marginTop: 16,
  },
  dash: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
    gap: 5,
  },
  dashRed: {
    width: 66,
    height: 7,
    borderRadius: 10,
    backgroundColor: colors.brandCoral,
    transform: [{ rotate: '-2deg' }],
  },
  dashYellow: {
    width: 25,
    height: 7,
    borderRadius: 10,
    backgroundColor: colors.brandSand,
    transform: [{ rotate: '4deg' }],
  },
  heroText: {
    color: colors.brandPaper,
    opacity: 0.9,
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 245,
    marginTop: 18,
  },
  sun: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.brandSand,
    right: -28,
    top: -38,
  },
  wave: {
    position: 'absolute',
    width: 185,
    height: 88,
    borderRadius: 70,
    backgroundColor: colors.brandBlue,
    right: -66,
    bottom: -38,
    transform: [{ rotate: '-12deg' }],
  },
  orangeBlob: {
    position: 'absolute',
    width: 55,
    height: 145,
    borderRadius: 24,
    backgroundColor: colors.brandTerracotta,
    right: 72,
    top: -34,
    transform: [{ rotate: '7deg' }],
  },
  blueBlob: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.brandCoral,
    left: -17,
    bottom: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 24,
  },
  heading: {
    marginBottom: 25,
  },
  title: {
    color: colors.brandInk,
    fontSize: 35,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 5,
  },
  label: {
    color: colors.brandInk,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.7,
    marginBottom: 6,
  },
  inputContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    marginLeft: 10,
    paddingVertical: 13,
  },
  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandCoral,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 22,
    paddingRight: 7,
    marginTop: 5,
    transform: [{ rotate: '-0.5deg' }],
  },
  buttonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  buttonArrow: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.brandSand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginTop: 24,
  },
  registerText: {
    color: colors.muted,
    fontSize: 13,
  },
  registerLink: {
    color: colors.brandTerracotta,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
});
