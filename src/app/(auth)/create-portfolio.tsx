import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../context/UserContext";

export default function CreatePortfolioScreen() {
  const router = useRouter();
  const { user, updateProfile } = useUser();

  const [especialidade, setEspecialidade] = useState(user?.especialidade || "");
  const [cidade, setCidade] = useState(user?.cidade || "");
  const [bio, setBio] = useState("");
  const [portfolio, setPortfolio] = useState<string[]>([
    "https://picsum.photos/seed/p1/300/300",
    "https://picsum.photos/seed/p2/300/300",
  ]);
  const [carregando, setCarregando] = useState(false);

  const handleAdicionarFoto = () => {
    // Simulação de adição de foto
    const novaFoto = `https://picsum.photos/seed/${Date.now()}/300/300`;
    setPortfolio((prev) => [...prev, novaFoto]);
  };

  const handleSalvarPerfil = async () => {
    if (!especialidade.trim() || !cidade.trim()) {
      Alert.alert("Atenção", "Preencha a especialidade e a cidade.");
      return;
    }

    try {
      setCarregando(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (updateProfile) {
        updateProfile({
          especialidade,
          cidade,
          bio,
        });
      }

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar dados do portfólio.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Configure seu Portfólio</Text>
        <Text style={styles.subtitle}>Mostre seu talento para os contratantes</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="brush-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Especialidade (ex: Fotógrafo, DJ, Videomaker)"
            placeholderTextColor="#999"
            value={especialidade}
            onChangeText={setEspecialidade}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Cidade - UF (ex: Santos - SP)"
            placeholderTextColor="#999"
            value={cidade}
            onChangeText={setCidade}
          />
        </View>

        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Fale um pouco sobre seu trabalho e experiência (Bio)"
            placeholderTextColor="#999"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Amostras de Portfólio */}
        <Text style={styles.sectionTitle}>Amostras do seu Trabalho</Text>
        <View style={styles.gridContainer}>
          {portfolio.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.gridImage} />
          ))}
          <TouchableOpacity style={styles.btnAddImage} onPress={handleAdicionarFoto}>
            <Ionicons name="add" size={32} color="#EC1B4B" />
            <Text style={styles.btnAddText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSalvarPerfil} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Concluir e Ir para o Mapa</Text>
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
  textAreaContainer: { height: 110, alignItems: "flex-start", paddingTop: 12 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#111" },
  textArea: { textAlignVertical: "top" },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#333", marginTop: 8, marginBottom: 12 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  gridImage: { width: 90, height: 90, borderRadius: 12 },
  btnAddImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EC1B4B",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5F7",
  },
  btnAddText: { fontSize: 11, color: "#EC1B4B", fontWeight: "600", marginTop: 2 },
  button: {
    backgroundColor: "#EC1B4B",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});