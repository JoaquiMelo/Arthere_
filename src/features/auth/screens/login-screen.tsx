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
        <View style={styles.brandPanel}>
          <View style={[styles.shapeBlue, { backgroundColor: colors.brandBlue }]} />
          <View style={[styles.shapeSand, { backgroundColor: colors.brandSand }]} />
          <View style={[styles.shapeCoral, { backgroundColor: colors.brandCoral }]} />
          <View style={styles.brandCopy}>
            <Text style={styles.kicker}>ARTE · ENCONTRO · TERRITÓRIO</Text>
            <Text style={styles.brand}>Arthere</Text>
            <View style={styles.brandRule} />
            <Text style={styles.brandDescription}>
              Conectando talentos criativos e projetos na Baixada Santista.
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.heading}>
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>Acesse seu espaço criativo.</Text>
          </View>

          <Text style={styles.label}>E-MAIL</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={19} color={colors.muted} />
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
            <Ionicons name="lock-closed-outline" size={19} color={colors.muted} />
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
                <Ionicons name="arrow-forward" size={17} color={colors.brandPaper} />
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
  brandPanel: {
    minHeight: 245,
    backgroundColor: colors.brandInk,
    overflow: 'hidden',
    position: 'relative',
  },
  brandCopy: {
    zIndex: 2,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    maxWidth: 340,
  },
  kicker: {
    color: colors.brandSand,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  brand: {
    color: colors.brandPaper,
    fontSize: 54,
    lineHeight: 56,
    fontWeight: '900',
    letterSpacing: -1.8,
    marginTop: 18,
  },
  brandRule: {
    width: 86,
    height: 7,
    backgroundColor: colors.brandCoral,
    marginTop: 12,
    marginBottom: 14,
  },
  brandDescription: {
    color: colors.brandPaper,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    maxWidth: 250,
  },
  shapeBlue: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 28,
    right: -18,
    bottom: -20,
    transform: [{ rotate: '20deg' }],
  },
  shapeSand: {
    position: 'absolute',
    width: 88,
    height: 55,
    borderRadius: 12,
    right: 34,
    top: 34,
    transform: [{ rotate: '-5deg' }],
  },
  shapeCoral: {
    position: 'absolute',
    width: 58,
    height: 150,
    borderRadius: 10,
    right: 100,
    top: -28,
    transform: [{ rotate: '2deg' }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 26,
  },
  heading: {
    marginBottom: 24,
  },
  title: {
    color: colors.brandInk,
    fontSize: 31,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  label: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 7,
  },
  inputContainer: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
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
    height: 52,
    backgroundColor: colors.brandInk,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    marginTop: 2,
  },
  buttonText: {
    color: colors.brandPaper,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginTop: 22,
  },
  registerText: {
    color: colors.muted,
    fontSize: 13,
  },
  registerLink: {
    color: colors.brandCoral,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
});
