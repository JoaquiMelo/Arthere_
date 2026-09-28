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

import { useTheme } from '@/providers/theme-provider';
import { useUser } from '@/providers/user-provider';

type TipoUsuario = 'AGENTE' | 'CONTRATANTE';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { palette } = useTheme();
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
      Alert.alert('Não foi possível cadastrar', e instanceof Error ? e.message : 'Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.miniHeader, { borderBottomColor: palette.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { borderColor: palette.brandInk }]}>
            <Ionicons name="arrow-back" size={18} color={palette.brandInk} />
          </TouchableOpacity>
          <View style={styles.brandLockup}>
            <Text style={[styles.brand, { color: palette.brandInk }]}>ARTHERE</Text>
            <Text style={[styles.brandSub, { color: palette.muted }]}>NOVO PERFIL</Text>
          </View>
          <Text style={[styles.headerLabel, { color: palette.muted }]}>CADASTRO</Text>
        </View>

        <View style={[styles.hero, { borderBottomColor: palette.border }]}>
          <Text style={[styles.kicker, { color: palette.muted }]}>CRIAR CONEXÕES</Text>
          <Text style={[styles.heroTitle, { color: palette.brandInk }]}>Faça parte da</Text>
          <Text style={[styles.heroTitleAccent, { color: palette.brandCoral }]}>cena criativa.</Text>
          <Text style={[styles.heroDescription, { color: palette.muted }]}>
            Crie um perfil para encontrar pessoas, projetos e oportunidades.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionKicker, { color: palette.muted }]}>01 · TIPO DE PERFIL</Text>
          <View style={styles.roles}>
            <TouchableOpacity
              style={[styles.role, { backgroundColor: palette.brandPaper, borderColor: palette.border }, tipoUsuario === 'AGENTE' && { backgroundColor: palette.brandSand, borderColor: palette.brandInk }]}
              onPress={() => setTipoUsuario('AGENTE')}
            >
              <View style={[styles.roleIcon, { backgroundColor: palette.surface }, tipoUsuario === 'AGENTE' && { backgroundColor: palette.brandPaper }]}>
                <Ionicons name="color-palette-outline" size={20} color={tipoUsuario === 'AGENTE' ? palette.brandInk : palette.muted} />
              </View>
              <Text style={[styles.roleTitle, { color: palette.brandInk }]}>Agente criativo</Text>
              <Text style={[styles.roleSub, { color: palette.muted }]}>Artista ou profissional</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.role, { backgroundColor: palette.brandPaper, borderColor: palette.border }, tipoUsuario === 'CONTRATANTE' && { backgroundColor: palette.brandSand, borderColor: palette.brandInk }]}
              onPress={() => setTipoUsuario('CONTRATANTE')}
            >
              <View style={[styles.roleIcon, { backgroundColor: palette.surface }, tipoUsuario === 'CONTRATANTE' && { backgroundColor: palette.brandPaper }]}>
                <Ionicons name="briefcase-outline" size={20} color={tipoUsuario === 'CONTRATANTE' ? palette.brandInk : palette.muted} />
              </View>
              <Text style={[styles.roleTitle, { color: palette.brandInk }]}>Contratante</Text>
              <Text style={[styles.roleSub, { color: palette.muted }]}>Empresa ou organização</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionKicker, { color: palette.muted }]}>02 · DADOS PESSOAIS</Text>
          <Field icon="card-outline" placeholder="CPF ou CNPJ *" value={documento} onChangeText={setDocumento} keyboardType="numeric" />
          <Field icon="person-outline" placeholder="Nome completo *" value={nome} onChangeText={setNome} />
          <Field icon="person-add-outline" placeholder="Nome social (opcional)" value={nomeSocial} onChangeText={setNomeSocial} />
          <Field icon="people-outline" placeholder="Pronomes (opcional)" value={pronomes} onChangeText={setPronomes} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionKicker, { color: palette.muted }]}>03 · ACESSO</Text>
          <Field icon="mail-outline" placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Field icon="lock-closed-outline" placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
        </View>

        {tipoUsuario === 'CONTRATANTE' ? (
          <View style={styles.section}>
            <Text style={[styles.sectionKicker, { color: palette.muted }]}>04 · ORGANIZAÇÃO</Text>
            <Field icon="business-outline" placeholder="Empresa / organização *" value={empresa} onChangeText={setEmpresa} />
            <Field icon="pricetag-outline" placeholder="Categoria de atuação" value={categoria} onChangeText={setCategoria} />
            <Field icon="call-outline" placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
            <Field icon="location-outline" placeholder="Cidade" value={cidade} onChangeText={setCidade} />
            <Field icon="navigate-outline" placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
            <Field icon="globe-outline" placeholder="Site ou rede social" value={site} onChangeText={setSite} />
            <TextInput style={[styles.textarea, { backgroundColor: palette.brandPaper, borderColor: palette.border, color: palette.brandInk }]} placeholder="Descreva a empresa, eventos e serviços..." placeholderTextColor={palette.muted} value={descricao} onChangeText={setDescricao} multiline maxLength={500} />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={[styles.sectionKicker, { color: palette.muted }]}>04 · PERFIL PROFISSIONAL</Text>
            <Field icon="sparkles-outline" placeholder="Especialidade" value={especialidade} onChangeText={setEspecialidade} />
            <Field icon="location-outline" placeholder="Cidade" value={cidade} onChangeText={setCidade} />
          </View>
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: palette.brandInk }]} onPress={handleRegister} disabled={carregando}>
          {carregando ? <ActivityIndicator color={palette.brandPaper} /> : (
            <>
              <Text style={[styles.buttonText, { color: palette.brandPaper }]}>
                {tipoUsuario === 'AGENTE' ? 'CONTINUAR PARA PORTFÓLIO' : 'PERSONALIZAR PERFIL'}
              </Text>
              <Ionicons name="arrow-forward" size={17} color={palette.brandPaper} />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.login}>
          <Text style={[styles.loginText, { color: palette.muted }]}>Já possui uma conta?</Text>
          <Text style={[styles.loginLink, { color: palette.brandCoral }]}>FAÇA LOGIN</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ icon, ...props }: { icon: keyof typeof Ionicons.glyphMap } & React.ComponentProps<typeof TextInput>) {
  const { palette } = useTheme();
  return (
    <View style={[styles.inputWrap, { backgroundColor: palette.brandPaper, borderColor: palette.border }]}>
      <Ionicons name={icon} size={18} color={palette.muted} />
      <TextInput style={[styles.input, { color: palette.brandInk }]} placeholderTextColor={palette.muted} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 36 },
  miniHeader: {
    minHeight: 62,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { width: 34, height: 34, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  brandLockup: { flex: 1, marginLeft: 12 },
  brand: { fontSize: 18, fontWeight: '900', letterSpacing: 1.5 },
  brandSub: { fontSize: 7, fontWeight: '800', letterSpacing: 1.1, marginTop: 2 },
  headerLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 1.4 },
  hero: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, borderBottomWidth: 1 },
  kicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
  heroTitle: { fontSize: 30, lineHeight: 33, fontWeight: '600', letterSpacing: -0.7 },
  heroTitleAccent: { fontSize: 30, lineHeight: 33, fontWeight: '800', letterSpacing: -0.7 },
  heroDescription: { fontSize: 12, lineHeight: 18, marginTop: 9, maxWidth: 310 },
  section: { paddingHorizontal: 20, marginTop: 22 },
  sectionKicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.3, marginBottom: 9 },
  roles: { flexDirection: 'row', gap: 9 },
  role: { flex: 1, minHeight: 122, borderWidth: 1, padding: 13 },
  roleIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  roleTitle: { fontSize: 13, fontWeight: '900' },
  roleSub: { fontSize: 10, lineHeight: 14, marginTop: 3 },
  inputWrap: { minHeight: 50, flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 13, marginBottom: 9 },
  input: { flex: 1, fontSize: 14, marginLeft: 9, paddingVertical: 12 },
  textarea: { minHeight: 110, borderWidth: 1, padding: 13, fontSize: 14, textAlignVertical: 'top' },
  button: { height: 52, marginHorizontal: 20, marginTop: 27, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  buttonText: { flex: 1, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  login: { marginTop: 20, alignItems: 'center', gap: 5 },
  loginText: { fontSize: 11 },
  loginLink: { fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
});
