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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={20} color={colors.brandPaper} />
          </TouchableOpacity>
          <View style={styles.headerShapes}>
            <View style={[styles.shapeBlue, { backgroundColor: colors.brandBlue }]} />
            <View style={[styles.shapeCoral, { backgroundColor: colors.brandCoral }]} />
          </View>
          <Text style={styles.headerKicker}>NOVO PERFIL</Text>
          <Text style={styles.headerTitle}>Faça parte do Arthere.</Text>
          <Text style={styles.headerText}>
            Crie um perfil para encontrar pessoas, projetos e oportunidades.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionKicker}>01 · TIPO DE PERFIL</Text>
          <View style={styles.roles}>
            <TouchableOpacity
              style={[
                styles.role,
                tipoUsuario === 'AGENTE' && styles.roleActive,
              ]}
              onPress={() => setTipoUsuario('AGENTE')}
            >
              <View
                style={[
                  styles.roleIcon,
                  tipoUsuario === 'AGENTE' && styles.roleIconActive,
                ]}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={20}
                  color={tipoUsuario === 'AGENTE' ? colors.brandInk : colors.muted}
                />
              </View>
              <Text style={styles.roleTitle}>Agente criativo</Text>
              <Text style={styles.roleSub}>Artista ou profissional</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.role,
                tipoUsuario === 'CONTRATANTE' && styles.roleActive,
              ]}
              onPress={() => setTipoUsuario('CONTRATANTE')}
            >
              <View
                style={[
                  styles.roleIcon,
                  tipoUsuario === 'CONTRATANTE' && styles.roleIconActive,
                ]}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color={tipoUsuario === 'CONTRATANTE' ? colors.brandInk : colors.muted}
                />
              </View>
              <Text style={styles.roleTitle}>Contratante</Text>
              <Text style={styles.roleSub}>Empresa ou organização</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionKicker}>02 · DADOS PESSOAIS</Text>
          <Field icon="card-outline" placeholder="CPF ou CNPJ *" value={documento} onChangeText={setDocumento} keyboardType="numeric" />
          <Field icon="person-outline" placeholder="Nome completo *" value={nome} onChangeText={setNome} />
          <Field icon="person-add-outline" placeholder="Nome social (opcional)" value={nomeSocial} onChangeText={setNomeSocial} />
          <Field icon="people-outline" placeholder="Pronomes (opcional)" value={pronomes} onChangeText={setPronomes} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionKicker}>03 · ACESSO</Text>
          <Field icon="mail-outline" placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Field icon="lock-closed-outline" placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
        </View>

        {tipoUsuario === 'CONTRATANTE' ? (
          <View style={styles.section}>
            <Text style={styles.sectionKicker}>04 · ORGANIZAÇÃO</Text>
            <Field icon="business-outline" placeholder="Empresa / organização *" value={empresa} onChangeText={setEmpresa} />
            <Field icon="pricetag-outline" placeholder="Categoria de atuação" value={categoria} onChangeText={setCategoria} />
            <Field icon="call-outline" placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
            <Field icon="location-outline" placeholder="Cidade" value={cidade} onChangeText={setCidade} />
            <Field icon="navigate-outline" placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
            <Field icon="globe-outline" placeholder="Site ou rede social" value={site} onChangeText={setSite} />
            <TextInput
              style={styles.textarea}
              placeholder="Descreva a empresa, eventos e serviços..."
              placeholderTextColor={colors.muted}
              value={descricao}
              onChangeText={setDescricao}
              multiline
              maxLength={500}
            />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionKicker}>04 · PERFIL PROFISSIONAL</Text>
            <Field icon="sparkles-outline" placeholder="Especialidade" value={especialidade} onChangeText={setEspecialidade} />
            <Field icon="location-outline" placeholder="Cidade" value={cidade} onChangeText={setCidade} />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color={colors.brandPaper} />
          ) : (
            <>
              <Text style={styles.buttonText}>
                {tipoUsuario === 'AGENTE' ? 'CONTINUAR PARA PORTFÓLIO' : 'PERSONALIZAR PERFIL'}
              </Text>
              <Ionicons name="arrow-forward" size={17} color={colors.brandPaper} />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.login}>
          <Text style={styles.loginText}>Já possui uma conta?</Text>
          <Text style={styles.loginLink}>FAÇA LOGIN</Text>
        </TouchableOpacity>
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
      <Ionicons name={icon} size={18} color={colors.muted} />
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
    paddingBottom: 36,
  },
  header: {
    backgroundColor: colors.brandInk,
    minHeight: 224,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 26,
    overflow: 'hidden',
    position: 'relative',
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(246,241,232,0.25)',
    marginBottom: 24,
  },
  headerShapes: {
    ...StyleSheet.absoluteFillObject,
  },
  shapeBlue: {
    position: 'absolute',
    width: 124,
    height: 124,
    right: -26,
    bottom: -28,
    borderRadius: 26,
    transform: [{ rotate: '17deg' }],
  },
  shapeCoral: {
    position: 'absolute',
    width: 62,
    height: 138,
    right: 88,
    top: -26,
    borderRadius: 10,
    transform: [{ rotate: '3deg' }],
  },
  headerKicker: {
    color: colors.brandSand,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  headerTitle: {
    color: colors.brandPaper,
    fontSize: 32,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginTop: 10,
  },
  headerText: {
    color: colors.brandPaper,
    opacity: 0.82,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 9,
    maxWidth: 290,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionKicker: {
    color: colors.brandInk,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  roles: {
    flexDirection: 'row',
    gap: 9,
  },
  role: {
    flex: 1,
    minHeight: 126,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
  },
  roleActive: {
    backgroundColor: colors.brandSand,
    borderColor: colors.brandInk,
  },
  roleIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginBottom: 14,
  },
  roleIconActive: {
    backgroundColor: colors.brandPaper,
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
  },
  inputWrap: {
    minHeight: 51,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 13,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    marginLeft: 9,
    paddingVertical: 12,
  },
  textarea: {
    minHeight: 110,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 13,
    color: colors.text,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  button: {
    height: 52,
    marginHorizontal: 20,
    marginTop: 28,
    paddingHorizontal: 16,
    backgroundColor: colors.brandInk,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    flex: 1,
    color: colors.brandPaper,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  login: {
    marginTop: 20,
    alignItems: 'center',
    gap: 5,
  },
  loginText: {
    color: colors.muted,
    fontSize: 12,
  },
  loginLink: {
    color: colors.brandCoral,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
