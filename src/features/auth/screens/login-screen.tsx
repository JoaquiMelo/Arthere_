import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/providers/user-provider";
import { colors } from "@/shared/theme/colors";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      Alert.alert("Atenção", "Informe o e-mail e a senha.");
      return;
    }

    try {
      setCarregando(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      if (login) {
        await login(email.trim(), senha);
      }

      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch {
      Alert.alert("Erro", "Não foi possível realizar o login.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Arthere</Text>
        <Text style={styles.subtitle}>Entre na sua conta</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {carregando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 36, fontWeight: "bold", color: colors.primaryDark, textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.muted, textAlign: "center", marginBottom: 32 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 12, paddingHorizontal: 16, height: 52, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: colors.text },
  button: { backgroundColor: colors.primaryDark, height: 52, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 8 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: "bold" },
  linkButton: { marginTop: 20, alignItems: "center" },
  linkText: { color: colors.muted, fontSize: 14 },
  linkBold: { color: colors.primaryDark, fontWeight: "bold" },
});
