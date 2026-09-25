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
  StatusBar,
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
      <StatusBar barStyle="dark-content" backgroundColor={colors.authBg} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View style={styles.brandDot}>
            <View style={styles.brandDotInner} />
          </View>
          <Text style={styles.topLabel}>ARTHERE</Text>
        </View>

        <View style={styles.hero}>
          <View style={styles.logoShadow}>
            <View style={styles.logoFrame}>
              <Image
                source={require('../../../../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
                accessibilityLabel="Logo do Arthere"
              />
            </View>
          </View>

          <View style={styles.copy}>
            <Text style={styles.eyebrow}>BEM-VINDO DE VOLTA</Text>
            <Text style={styles.title}>Entre no{'
'}Arthere.</Text>
            <Text style={styles.description}>
              Conecte-se à comunidade criativa da Baixada Santista e continue descobrindo novos talentos.
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-MAIL</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={19} color={colors.authPrimary} />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.authMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.label}>SENHA</Text>
            <TouchableOpacity>
              <Text style={styles.forgot}>ESQUECI</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={19} color={colors.authPrimary} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor={colors.authMuted}
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
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={16} color={colors.authPrimary} />
                </View>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>CRIAR NOVO PERFIL</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>ARTHERE · ARTE, CULTURA E CONEXÕES</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.authBg },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 28,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 30,
  },
  brandDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.authPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.authWhite,
  },
  topLabel: {
    color: colors.authInk,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 28,
  },
  logoShadow: {
    borderRadius: 25,
    shadowColor: '#0A56D7',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  logoFrame: {
    width: 94,
    height: 94,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: colors.authWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 86,
    height: 86,
    transform: [{ scale: 1.15 }],
  },
  copy: { flex: 1 },
  eyebrow: {
    color: colors.authPrimary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    color: colors.authInk,
    fontFamily: displayFont,
    fontSize: 38,
    lineHeight: 37,
    fontWeight: '900',
    letterSpacing: -1.3,
  },
  description: {
    marginTop: 10,
    color: colors.authMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  form: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.authWhite,
    borderWidth: 1,
    borderColor: colors.authBorder,
    shadowColor: '#102A43',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    marginBottom: 8,
    color: colors.authInk,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  forgot: {
    marginBottom: 8,
    color: colors.authPrimary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  inputContainer: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 16,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.authBorder,
    backgroundColor: colors.authSoft,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 13,
    color: colors.authInk,
    fontSize: 14,
  },
  button: {
    height: 56,
    marginTop: 3,
    paddingLeft: 20,
    paddingRight: 8,
    borderRadius: 19,
    backgroundColor: colors.authPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: colors.authWhite,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.authWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 18,
  },
  divider: { flex: 1, height: 1, backgroundColor: colors.authBorder },
  dividerText: {
    color: colors.authMuted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  secondaryButton: {
    height: 52,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.authPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.authWhite,
  },
  secondaryButtonText: {
    color: colors.authPrimary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  footer: {
    marginTop: 22,
    color: colors.authMuted,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
});
