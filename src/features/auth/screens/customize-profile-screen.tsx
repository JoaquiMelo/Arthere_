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

export default function CustomizeProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, updateProfile } = useUser();

  const [nomeEmpresa, setNomeEmpresa] = useState(user?.nome || "");
  const [cidade, setCidade] = useState(user?.cidade || "");
  const [telefone, setTelefone] = useState("");
  const [interessePrincipal, setInteressePrincipal] = useState("Fotografia");
  const [carregando, setCarregando] = useState(false);

  const categorias = ["Fotografia", "Música / DJ", "Videomaker", "Design"];

  const handleSalvarPerfil = async () => {
    if (!nomeEmpresa.trim() || !cidade.trim()) {
      Alert.alert("Atenção", "Preencha o nome de exibição e a cidade.");
      return;
    }

    try {
      setCarregando(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (updateProfile) {
        updateProfile({
          nome: nomeEmpresa,
          cidade,
        });
      }

      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch {
      Alert.alert("Erro", "Falha ao salvar preferências de perfil.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Personalize seu Perfil</Text>
        <Text style={styles.subtitle}>Ajuste suas informações para buscar profissionais</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="business-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nome da empresa ou Nome Pessoal"
            placeholderTextColor="#999"
            value={nomeEmpresa}
            onChangeText={setNomeEmpresa}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Sua Cidade - UF (ex: Santos - SP)"
            placeholderTextColor="#999"
            value={cidade}
            onChangeText={setCidade}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Telefone / WhatsApp de Contato"
            placeholderTextColor="#999"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.sectionTitle}>O que você mais costuma contratar?</Text>
        <View style={styles.chipsContainer}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.chip,
                interessePrincipal === cat && styles.chipSelected,
              ]}
              onPress={() => setInteressePrincipal(cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  interessePrincipal === cat && styles.chipTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSalvarPerfil} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Concluir e Explorar Artistas</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F7FA" },
  scrollContent: { padding: 24 },
  title: { fontSize: 26, fontWeight: "bold", color: "#111", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 24 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#111" },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#333", marginTop: 8, marginBottom: 12 },
  chipsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 32 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipSelected: { backgroundColor: "#EC1B4B", borderColor: "#EC1B4B" },
  chipText: { fontSize: 13, color: "#666", fontWeight: "600" },
  chipTextSelected: { color: "#FFF" },
  button: {
    backgroundColor: "#EC1B4B",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
