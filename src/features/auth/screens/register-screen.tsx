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
        documento,
        nome,
        nomeSocial,
        pronomes,
        email,
        tipo: tipoUsuario,
        empresa,
        telefone,
        categoria,
        cidade,
        endereco,
        site,
        descricao,
        especialidade,
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
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.authBlue} />
          </TouchableOpacity>

          <Text style={styles.title}>Crie seu{"\n"}perfil criativo</Text>

          <View style={styles.logoFrame}>
            <Image
              source={require('../../../../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo do Arthere"
            />
          </View>

          <Text style={styles.description}>
            Mostre seu trabalho, encontre pessoas e abra espaço para novas oportunidades.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>COMO VOCÊ VAI USAR O ARTHERE?</Text>
          <View style={styles.roles}>
            <TouchableOpacity
              style={[styles.role, tipoUsuario === 'AGENTE' && styles.roleActive]}
              onPress={() => setTipoUsuario('AGENTE')}
            >
              <Ionicons
                name="color-palette-outline"
                size={22}
                color={tipoUsuario === 'AGENTE' ? colors.authWhite : colors.authBlue}
              />
              <Text style={[styles.roleTitle, tipoUsuario === 'AGENTE' && styles.roleTitleActive]}>
                Agente criativo
              </Text>
              <Text style={styles.roleSub}>Artista ou profissional</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.role, tipoUsuario === 'CONTRATANTE' && styles.roleActive]}
              onPress={() => setTipoUsuario('CONTRATANTE')}
            >
              <Ionicons
                name="briefcase-outline"
                size={22}
                color={tipoUsuario === 'CONTRATANTE' ? colors.authWhite : colors.authBlue}
              />
              <Text
                style={[
                  styles.roleTitle,
                  tipoUsuario === 'CONTRATANTE' && styles.roleTitleActive,
                ]}
              >
                Contratante
              </Text>
              <Text style={styles.roleSub}>Empresa ou organização</Text>
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
                placeholderTextColor={colors.authInk}
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
                <Ionicons name="arrow-forward" size={19} color={colors.authWhite} />
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
      <Ionicons name={icon} size={18} color={colors.authBlue} />
      <TextInput style={styles.input} placeholderTextColor={colors.authInk} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.authSky,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 38,
  },
  hero: {
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    marginBottom: 18,
    borderRadius: 22,
    backgroundColor: colors.authWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.authBlue,
    fontFamily: displayFont,
    fontSize: 44,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: -1.4,
    textAlign: 'center',
  },
  logoFrame: {
    width: 136,
    height: 136,
    marginTop: 20,
    marginBottom: 16,
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
    maxWidth: 330,
    color: colors.authBlue,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    marginTop: 28,
    padding: 16,
    borderRadius: 28,
    backgroundColor: 'rgba(255,253,249,0.68)',
  },
  sectionTitle: {
    marginTop: 7,
    marginBottom: 10,
    color: colors.authInk,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  roles: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 17,
  },
  role: {
    flex: 1,
    minHeight: 118,
    padding: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.authLine,
    backgroundColor: colors.authWhite,
  },
  roleActive: {
    borderColor: colors.authBlue,
    backgroundColor: colors.authBlue,
  },
  roleTitle: {
    marginTop: 12,
    color: colors.authBlue,
    fontSize: 13,
    fontWeight: '900',
  },
  roleTitleActive: {
    color: colors.authWhite,
  },
  roleSub: {
    marginTop: 3,
    color: colors.authInk,
    fontSize: 10,
    lineHeight: 14,
  },
  inputWrap: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.authLine,
    backgroundColor: colors.authWhite,
  },
  input: {
    flex: 1,
    marginLeft: 9,
    paddingVertical: 12,
    color: colors.authInk,
    fontSize: 14,
  },
  textarea: {
    minHeight: 110,
    marginBottom: 4,
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.authLine,
    backgroundColor: colors.authWhite,
    color: colors.authInk,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  button: {
    height: 56,
    marginTop: 22,
    paddingHorizontal: 19,
    borderRadius: 28,
    backgroundColor: colors.authBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    flex: 1,
    color: colors.authWhite,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  login: {
    alignItems: 'center',
    marginTop: 18,
    gap: 4,
  },
  loginText: {
    color: colors.authInk,
    fontSize: 12,
    fontWeight: '600',
  },
  loginLink: {
    color: colors.authBlue,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
});
