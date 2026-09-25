import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.headerShapes}>
            <View style={styles.yellowBlob} />
            <View style={styles.blueBlob} />
            <View style={styles.orangeBlob} />
            <View style={styles.redDot} />
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={19} color={colors.brandInk} />
          </TouchableOpacity>

          <Text style={styles.headerKicker}>NOVO PERFIL</Text>
          <Text style={styles.headerTitle}>Faça parte do Arthere.</Text>
          <Text style={styles.headerText}>
            Crie um perfil para encontrar pessoas, projetos e oportunidades.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionNumber}>01</Text>
            <View>
              <Text style={styles.sectionKicker}>TIPO DE PERFIL</Text>
              <Text style={styles.sectionHint}>Como você chega ao Arthere?</Text>
            </View>
          </View>

          <View style={styles.roles}>
            <TouchableOpacity
              style={[styles.role, tipoUsuario === 'AGENTE' && styles.roleActive]}
              onPress={() => setTipoUsuario('AGENTE')}
            >
              <View style={[styles.roleIcon, tipoUsuario === 'AGENTE' && styles.roleIconActive]}>
                <Ionicons
                  name="color-palette-outline"
                  size={21}
                  color={tipoUsuario === 'AGENTE' ? colors.brandInk : colors.brandTerracotta}
                />
              </View>
              <Text style={styles.roleTitle}>Agente criativo</Text>
              <Text style={styles.roleSub}>Artista ou profissional</Text>
              {tipoUsuario === 'AGENTE' && <View style={styles.roleMark} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.role, tipoUsuario === 'CONTRATANTE' && styles.roleActiveContractor]}
              onPress={() => setTipoUsuario('CONTRATANTE')}
            >
              <View
                style={[
                  styles.roleIcon,
                  tipoUsuario === 'CONTRATANTE' && styles.roleIconContractor,
                ]}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={21}
                  color={tipoUsuario === 'CONTRATANTE' ? colors.brandInk : colors.brandBlue}
                />
              </View>
              <Text style={styles.roleTitle}>Contratante</Text>
              <Text style={styles.roleSub}>Empresa ou organização</Text>
              {tipoUsuario === 'CONTRATANTE' && <View style={styles.roleMarkBlue} />}
            </TouchableOpacity>
          </View>

          <Section title="DADOS PESSOAIS" number="02">
            <Field icon="card-outline" placeholder="CPF ou CNPJ *" value={documento} onChangeText={setDocumento} keyboardType="numeric" />
            <Field icon="person-outline" placeholder="Nome completo *" value={nome} onChangeText={setNome} />
            <Field icon="person-add-outline" placeholder="Nome social (opcional)" value={nomeSocial} onChangeText={setNomeSocial} />
            <Field icon="people-outline" placeholder="Pronomes (opcional)" value={pronomes} onChangeText={setPronomes} />
          </Section>

          <Section title="ACESSO" number="03">
            <Field icon="mail-outline" placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <Field icon="lock-closed-outline" placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
          </Section>

          {tipoUsuario === 'CONTRATANTE' ? (
            <Section title="ORGANIZAÇÃO" number="04">
              <Field icon="business-outline" placeholder="Empresa / organização *" value={empresa} onChangeText={setEmpresa} />
              <Field icon="pricetag-outline" placeholder="Categoria de atuação" value={categoria} onChangeText={setCategoria} />
              <Field icon="call-outline" placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
              <Field icon="location-outline" placeholder="Cidade" value={cidade} onChangeText={setCidade} />
              <Field icon="navigate-outline" placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
              <Field icon="globe-outline" placeholder="Site ou rede social" value={site} onChangeText={setSite} />
              <TextInput
                style={styles.textarea}
                placeholder="Conte um pouco sobre a organização..."
                placeholderTextColor={colors.muted}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                maxLength={500}
              />
            </Section>
          ) : (
            <Section title="PERFIL PROFISSIONAL" number="04">
              <Field icon="sparkles-outline" placeholder="Especialidade" value={especialidade} onChangeText={setEspecialidade} />
              <Field icon="location-outline" placeholder="Cidade" value={cidade} onChangeText={setCidade} />
            </Section>
          )}

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color={colors.brandInk} />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {tipoUsuario === 'AGENTE' ? 'CONTINUAR PARA PORTFÓLIO' : 'PERSONALIZAR PERFIL'}
                </Text>
                <View style={styles.buttonArrow}>
                  <Ionicons name="arrow-forward" size={17} color={colors.brandInk} />
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

function Section({
  title,
  number,
  children,
}: {
  title: string;
  number: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionNumber}>{number}</Text>
        <View>
          <Text style={styles.sectionKicker}>{title}</Text>
          <View style={styles.sectionLine} />
        </View>
      </View>
      {children}
    </View>
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
      <View style={styles.inputIcon}>
        <Ionicons name={icon} size={17} color={colors.brandInk} />
      </View>
      <TextInput style={styles.input} placeholderTextColor={colors.muted} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandPaper,
  },
  content: {
    paddingBottom: 42,
  },
  header: {
    minHeight: 238,
    backgroundColor: colors.brandInk,
    paddingHorizontal: 22,
    paddingTop: 15,
    paddingBottom: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  headerShapes: {
    ...StyleSheet.absoluteFillObject,
  },
  yellowBlob: {
    position: 'absolute',
    width: 118,
    height: 82,
    borderRadius: 55,
    right: -26,
    top: -22,
    backgroundColor: colors.brandSand,
    transform: [{ rotate: '-8deg' }],
  },
  blueBlob: {
    position: 'absolute',
    width: 132,
    height: 112,
    borderRadius: 60,
    right: -35,
    bottom: -40,
    backgroundColor: colors.brandBlue,
    transform: [{ rotate: '14deg' }],
  },
  orangeBlob: {
    position: 'absolute',
    width: 49,
    height: 136,
    borderRadius: 25,
    right: 72,
    top: -31,
    backgroundColor: colors.brandTerracotta,
    transform: [{ rotate: '5deg' }],
  },
  redDot: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    left: -18,
    bottom: 24,
    backgroundColor: colors.brandCoral,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brandSand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },
  headerKicker: {
    color: colors.brandSand,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  headerTitle: {
    color: colors.brandPaper,
    fontSize: 33,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginTop: 9,
  },
  headerText: {
    color: colors.brandPaper,
    opacity: 0.9,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 9,
    maxWidth: 280,
  },
  form: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 27,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
    gap: 10,
  },
  sectionNumber: {
    color: colors.brandCoral,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: colors.brandSand,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  sectionKicker: {
    color: colors.brandInk,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  sectionHint: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  sectionLine: {
    height: 3,
    width: 30,
    borderRadius: 5,
    backgroundColor: colors.brandBlue,
    marginTop: 5,
  },
  roles: {
    flexDirection: 'row',
    gap: 10,
  },
  role: {
    flex: 1,
    minHeight: 132,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  roleActive: {
    backgroundColor: colors.brandSand,
    borderColor: colors.brandInk,
    transform: [{ rotate: '-1deg' }],
  },
  roleActiveContractor: {
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.brandInk,
    transform: [{ rotate: '1deg' }],
  },
  roleIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  roleIconActive: {
    backgroundColor: colors.white,
  },
  roleIconContractor: {
    backgroundColor: colors.white,
  },
  roleTitle: {
    color: colors.brandInk,
    fontSize: 13,
    fontWeight: '900',
  },
  roleSub: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
    maxWidth: 105,
  },
  roleMark: {
    position: 'absolute',
    width: 42,
    height: 7,
    borderRadius: 8,
    backgroundColor: colors.brandCoral,
    right: 10,
    bottom: 12,
    transform: [{ rotate: '-4deg' }],
  },
  roleMarkBlue: {
    position: 'absolute',
    width: 42,
    height: 7,
    borderRadius: 8,
    backgroundColor: colors.brandTerracotta,
    right: 10,
    bottom: 12,
    transform: [{ rotate: '4deg' }],
  },
  inputWrap: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 11,
    marginBottom: 10,
  },
  inputIcon: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceStrong,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    marginLeft: 9,
    paddingVertical: 12,
  },
  textarea: {
    minHeight: 112,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 13,
    color: colors.text,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  button: {
    minHeight: 58,
    borderRadius: 29,
    marginTop: 30,
    paddingLeft: 21,
    paddingRight: 7,
    backgroundColor: colors.brandCoral,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    transform: [{ rotate: '0.5deg' }],
  },
  buttonText: {
    flex: 1,
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  buttonArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brandSand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    marginTop: 21,
    alignItems: 'center',
    gap: 5,
  },
  loginText: {
    color: colors.muted,
    fontSize: 12,
  },
  loginLink: {
    color: colors.brandTerracotta,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
