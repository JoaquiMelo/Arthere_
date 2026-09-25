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

type TipoUsuario = 'AGENTE' | 'CONTRATANTE';

const displayFont = Platform.select({
  ios: 'Arial Rounded MT Bold',
  android: 'sans-serif-black',
  default: 'sans-serif-black',
});

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { updateProfile } = useUser();
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>('AGENTE');
  const [documento, setDocumento] = useState('');
  const [nome, setNome] = useState('');
  const [nomeSocial, setNomeSocial] = useState('');
  const [pronomes, setPronomes] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [telefone, setTelefone] = useState('');
  const [categoria, setCategoria] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [site, setSite] = useState('');
  const [descricao, setDescricao] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleRegister = async () => {
    if (!documento.trim() || !nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }
    if (tipoUsuario === 'CONTRATANTE' && !empresa.trim()) {
      Alert.alert('Atenção', 'Informe o nome da empresa ou organização.');
      return;
    }

    setCarregando(true);
    try {
      updateProfile({
        documento, nome, nomeSocial, pronomes, email, tipo: tipoUsuario,
        empresa, telefone, categoria, cidade, endereco, site, descricao, especialidade,
      });
      navigation.navigate(tipoUsuario === 'AGENTE' ? 'CreatePortfolio' : 'CustomizeProfile');
    } catch (e) {
      Alert.alert(
        'Não foi possível cadastrar',
        e instanceof Error ? e.message : 'Tente novamente.',
      );
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={19} color={colors.authInk} />
          </TouchableOpacity>
          <View>
            <Text style={styles.eyebrow}>COMECE POR AQUI</Text>
            <Text style={styles.title}>Crie seu perfil.</Text>
          </View>
        </View>

        <View style={styles.brandCard}>
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
          <View style={styles.brandCopy}>
            <Text style={styles.brandTitle}>Faça parte do Arthere</Text>
            <Text style={styles.brandText}>
              Apresente seu trabalho ou encontre profissionais criativos perto de você.
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>COMO VOCÊ VAI USAR?</Text>
          <View style={styles.roles}>
            <TouchableOpacity
              style={[styles.role, tipoUsuario === 'AGENTE' && styles.roleActive]}
              onPress={() => setTipoUsuario('AGENTE')}
            >
              <View style={[styles.roleIcon, tipoUsuario === 'AGENTE' && styles.roleIconActive]}>
                <Ionicons
                  name="color-palette-outline"
                  size={20}
                  color={tipoUsuario === 'AGENTE' ? colors.authPrimary : colors.authMuted}
                />
              </View>
              <View style={styles.roleCopy}>
                <Text style={[styles.roleTitle, tipoUsuario === 'AGENTE' && styles.roleTitleActive]}>
                  Agente criativo
                </Text>
                <Text style={[styles.roleSub, tipoUsuario === 'AGENTE' && styles.roleSubActive]}>
                  Artista ou profissional
                </Text>
              </View>
              {tipoUsuario === 'AGENTE' && <Ionicons name="checkmark-circle" size={22} color={colors.authPrimary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.role, tipoUsuario === 'CONTRATANTE' && styles.roleActive]}
              onPress={() => setTipoUsuario('CONTRATANTE')}
            >
              <View style={[styles.roleIcon, tipoUsuario === 'CONTRATANTE' && styles.roleIconActive]}>
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color={tipoUsuario === 'CONTRATANTE' ? colors.authPrimary : colors.authMuted}
                />
              </View>
              <View style={styles.roleCopy}>
                <Text style={[styles.roleTitle, tipoUsuario === 'CONTRATANTE' && styles.roleTitleActive]}>
                  Contratante
                </Text>
                <Text style={[styles.roleSub, tipoUsuario === 'CONTRATANTE' && styles.roleSubActive]}>
                  Empresa ou organização
                </Text>
              </View>
              {tipoUsuario === 'CONTRATANTE' && <Ionicons name="checkmark-circle" size={22} color={colors.authPrimary} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>SEUS DADOS</Text>
          <Field icon="card-outline" placeholder="CPF ou CNPJ *" value={documento} onChangeText={setDocumento} keyboardType="numeric" />
          <Field icon="person-outline" placeholder="Nome completo *" value={nome} onChangeText={setNome} />
          <Field icon="person-add-outline" placeholder="Nome social (opcional)" value={nomeSocial} onChangeText={setNomeSocial} />
          <Field icon="people-outline" placeholder="Pronomes (opcional)" value={pronomes} onChangeText={setPronomes} />

          <Text style={styles.sectionTitle}>ACESSO</Text>
          <Field icon="mail-outline" placeholder="E-mail *" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Field icon="lock-closed-outline" placeholder="Senha *" value={senha} onChangeText={setSenha} secureTextEntry />

          {tipoUsuario === 'CONTRATANTE' ? (
            <>
              <Text style={styles.sectionTitle}>ORGANIZAÇÃO</Text>
              <Field icon="business-outline" placeholder="Empresa / organização *" value={empresa} onChangeText={setEmpresa} />
              <Field icon="pricetag-outline" placeholder="Categoria de atuação" value={categoria} onChangeText={setCategoria} />
              <Field icon="call-outline" placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
              <Field icon="location-outline" placeholder="Cidade" value={cidade} onChangeText={setCidade} />
              <Field icon="navigate-outline" placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
              <Field icon="globe-outline" placeholder="Site ou rede social" value={site} onChangeText={setSite} />
              <TextInput
                style={styles.textarea}
                placeholder="Conte um pouco sobre a empresa, eventos e serviços..."
                placeholderTextColor={colors.authMuted}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                maxLength={500}
              />
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>PERFIL PROFISSIONAL</Text>
              <Field icon="sparkles-outline" placeholder="Especialidade" value={especialidade} onChangeText={setEspecialidade} />
              <Field icon="location-outline" placeholder="Cidade" value={cidade} onChangeText={setCidade} />
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color={colors.authWhite} />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {tipoUsuario === 'AGENTE' ? 'CONTINUAR PARA PORTFÓLIO' : 'PERSONALIZAR PERFIL'}
                </Text>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={16} color={colors.authPrimary} />
                </View>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.login}>
            <Text style={styles.loginText}>Já possui uma conta?</Text>
            <Text style={styles.loginLink}>FAÇA LOGIN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  icon,
  ...props
}: {
  icon: keyof typeof Ionicons.glyphMap;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.inputWrap}>
      <Ionicons name={icon} size={18} color={colors.authPrimary} />
      <TextInput style={styles.input} placeholderTextColor={colors.authMuted} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.authBg },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 34 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 22,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: colors.authWhite,
    borderWidth: 1,
    borderColor: colors.authBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: colors.authPrimary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    color: colors.authInk,
    fontFamily: displayFont,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -1.1,
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 14,
    marginBottom: 18,
    borderRadius: 24,
    backgroundColor: colors.authPrimary,
  },
  logoShadow: {
    borderRadius: 20,
    shadowColor: '#071B3A',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  logoFrame: {
    width: 78,
    height: 78,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.authWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    transform: [{ scale: 1.15 }],
  },
  brandCopy: { flex: 1 },
  brandTitle: {
    color: colors.authWhite,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
  },
  brandText: {
    color: '#DCE9FF',
    fontSize: 12,
    lineHeight: 17,
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
  sectionTitle: {
    marginTop: 6,
    marginBottom: 10,
    color: colors.authInk,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  roles: { gap: 9, marginBottom: 15 },
  role: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.authBorder,
    backgroundColor: colors.authWhite,
  },
  roleActive: {
    borderColor: '#B9D0FF',
    backgroundColor: colors.authSoft,
  },
  roleIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F4F6F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconActive: { backgroundColor: colors.authWhite },
  roleCopy: { flex: 1, marginLeft: 11 },
  roleTitle: { color: colors.authInk, fontSize: 13, fontWeight: '900' },
  roleTitleActive: { color: colors.authPrimary },
  roleSub: { marginTop: 2, color: colors.authMuted, fontSize: 10 },
  roleSubActive: { color: colors.authMuted },
  inputWrap: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.authBorder,
    backgroundColor: colors.authSoft,
  },
  input: {
    flex: 1,
    marginLeft: 9,
    paddingVertical: 12,
    color: colors.authInk,
    fontSize: 14,
  },
  textarea: {
    minHeight: 105,
    marginBottom: 4,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.authBorder,
    backgroundColor: colors.authSoft,
    color: colors.authInk,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  button: {
    height: 56,
    marginTop: 18,
    paddingLeft: 19,
    paddingRight: 8,
    borderRadius: 19,
    backgroundColor: colors.authPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    flex: 1,
    color: colors.authWhite,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.authWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: { alignItems: 'center', marginTop: 18, gap: 4 },
  loginText: { color: colors.authMuted, fontSize: 11 },
  loginLink: {
    color: colors.authPrimary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
