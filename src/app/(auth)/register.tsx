import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { useUser } from "../../context/UserContext";

type TipoUsuario = "AGENTE" | "CONTRATANTE";

export default function RegisterScreen() {
  const router = useRouter();
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
        router.replace("/(auth)/create-portfolio");
      } else {
        router.replace("/(auth)/customize-profile");
      }
    } catch (error) {
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
                color={tipoUsuario === "AGENTE" ? "#EC1B4B" : "#666"}
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
                color={tipoUsuario === "CONTRATANTE" ? "#EC1B4B" : "#666"}
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
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#999"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={carregando}>
            {carregando ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>
                {tipoUsuario === "AGENTE" ? "Continuar para Portfólio" : "Personalizar Perfil"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.linkButton}>
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
  container: { flex: 1, backgroundColor: "#F8F7FA" },
  scrollContent: { flexGrow: 1, justifyContent: "center" },
  content: { paddingHorizontal: 24, paddingVertical: 32 },
  title: { fontSize: 36, fontWeight: "bold", color: "#EC1B4B", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#666", textAlign: "center", marginBottom: 24 },
  sectionLabel: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 12 },
  roleContainer: { flexDirection: "row", gap: 12, marginBottom: 20 },
  roleCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  roleCardActive: { borderColor: "#EC1B4B", backgroundColor: "#FFF5F7" },
  roleTitle: { fontSize: 13, fontWeight: "bold", color: "#333", marginTop: 6 },
  roleTextActive: { color: "#EC1B4B" },
  roleSubtext: { fontSize: 10, color: "#888", marginTop: 2, textAlign: "center" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#111" },
  button: {
    backgroundColor: "#EC1B4B",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  linkButton: { marginTop: 20, alignItems: "center" },
  linkText: { color: "#666", fontSize: 14 },
  linkBold: { color: "#EC1B4B", fontWeight: "bold" },
});