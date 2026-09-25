import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useUser } from '@/providers/user-provider';
import { colors } from '@/shared/theme/colors';

const displayFont = Platform.select({
  ios: 'Arial Rounded MT Bold',
  android: 'sans-serif-black',
  default: 'sans-serif-black',
});

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
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Entre no{"\n"}Arthere</Text>

          <View style={styles.logoFrame}>
            <Image
              source={require('../../../../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo do Arthere"
            />
          </View>

          <Text style={styles.description}>
            Encontre talentos criativos, descubra projetos e faça novas conexões na Baixada Santista.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-MAIL</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={19} color={colors.authBlue} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.authInk}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>SENHA</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={19} color={colors.authBlue} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor={colors.authInk}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color={colors.authWhite} />
            ) : (
              <>
                <Text style={styles.buttonText}>ENTRAR</Text>
                <Ionicons name="arrow-forward" size={19} color={colors.authWhite} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Ainda não tem uma conta?</Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.secondaryButtonText}>CRIAR PERFIL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.authSky,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 36,
  },
  hero: {
    alignItems: 'center',
  },
  title: {
    color: colors.authBlue,
    fontFamily: displayFont,
    fontSize: 48,
    lineHeight: 45,
    fontWeight: '900',
    letterSpacing: -1.7,
    textAlign: 'center',
  },
  logoFrame: {
    width: 150,
    height: 150,
    marginTop: 24,
    marginBottom: 18,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.authWhite,
    borderWidth: 2,
    borderColor: colors.authBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  description: {
    maxWidth: 335,
    color: colors.authBlue,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    marginTop: 30,
    padding: 18,
    borderRadius: 28,
    backgroundColor: 'rgba(255,253,249,0.68)',
  },
  label: {
    marginBottom: 7,
    color: colors.authInk,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  inputContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.authLine,
    backgroundColor: colors.authWhite,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 13,
    color: colors.authInk,
    fontSize: 15,
  },
  button: {
    height: 56,
    marginTop: 4,
    paddingHorizontal: 20,
    borderRadius: 28,
    backgroundColor: colors.authBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: colors.authWhite,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  registerRow: {
    alignItems: 'center',
    marginTop: 18,
    gap: 9,
  },
  registerText: {
    color: colors.authInk,
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.authBlue,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.authWhite,
  },
  secondaryButtonText: {
    color: colors.authBlue,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
});
