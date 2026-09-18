import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
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
} from "react-native";
import { useUser } from "@/providers/user-provider";
import { colors } from "@/shared/theme/colors";

type TipoUsuario = "AGENTE" | "CONTRATANTE";

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { updateProfile } = useUser();

  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("AGENTE");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);

      // Simulação em memória para a prévia (sem banco)
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Salva o tipo e nome no estado global do app
      if (updateProfile) {
        updateProfile({
          nome,
          email,
          tipo: tipoUsuario,
        });
      }

      // Redirecionamento condicional de acordo com o tipo de conta
      if (tipoUsuario === "AGENTE") {
        navigation.navigate("CreatePortfolio");
      } else {
        navigation.navigate("CustomizeProfile");
      }
    } catch {
      Alert.alert("Erro", "Não foi possível concluir o cadastro.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Arthere</Text>
          <Text style={styles.subtitle}>Crie sua conta para começar</Text>

          {/* Seleção de Tipo de Perfil */}
          <Text style={styles.sectionLabel}>Qual é o seu perfil?</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleCard,
                tipoUsuario === "AGENTE" && styles.roleCardActive,
              ]}
              onPress={() => setTipoUsuario("AGENTE")}
            >
              <Ionicons
                name="color-palette-outline"
                size={24}
                color={tipoUsuario === "AGENTE" ? colors.primaryDark : colors.muted}
              />
              <Text
                style={[
                  styles.roleTitle,
                  tipoUsuario === "AGENTE" && styles.roleTextActive,
                ]}
              >
                Agente Criativo
              </Text>
              <Text style={styles.roleSubtext}>Sou artista / profissional</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                tipoUsuario === "CONTRATANTE" && styles.roleCardActive,
              ]}
              onPress={() => setTipoUsuario("CONTRATANTE")}
            >
              <Ionicons
                name="briefcase-outline"
                size={24}
                color={tipoUsuario === "CONTRATANTE" ? colors.primaryDark : colors.muted}
              />
              <Text
                style={[
                  styles.roleTitle,
                  tipoUsuario === "CONTRATANTE" && styles.roleTextActive,
                ]}
              >
                Contratante
              </Text>
              <Text style={styles.roleSubtext}>Quero contratar serviços</Text>
            </TouchableOpacity>
          </View>

          {/* Campos de formulário */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.muted} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              placeholderTextColor={colors.muted}
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.muted} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.muted} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={colors.muted}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                {tipoUsuario === "AGENTE" ? "Continuar para Portfólio" : "Personalizar Perfil"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkButton}>
            <Text style={styles.linkText}>
              Já possui uma conta? <Text style={styles.linkBold}>Faça Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: "center" },
  content: { paddingHorizontal: 24, paddingVertical: 32 },
  title: { fontSize: 36, fontWeight: "bold", color: colors.primaryDark, textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.muted, textAlign: "center", marginBottom: 24 },
  sectionLabel: { fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 12 },
  roleContainer: { flexDirection: "row", gap: 12, marginBottom: 20 },
  roleCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  roleCardActive: { borderColor: colors.primaryDark, backgroundColor: colors.surfaceStrong },
  roleTitle: { fontSize: 13, fontWeight: "bold", color: colors.text, marginTop: 6 },
  roleTextActive: { color: colors.primaryDark },
  roleSubtext: { fontSize: 10, color: colors.muted, marginTop: 2, textAlign: "center" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: colors.text },
  button: {
    backgroundColor: colors.primaryDark,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  linkButton: { marginTop: 20, alignItems: "center" },
  linkText: { color: colors.muted, fontSize: 14 },
  linkBold: { color: colors.primaryDark, fontWeight: "bold" },
});
