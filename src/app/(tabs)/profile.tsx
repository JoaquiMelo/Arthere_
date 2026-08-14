import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUsuario } from "../../../backend/src/context/UserContext";

// ─── Tela de Perfil Editável ──────────────────────────────────────────────────
export default function ProfileScreen() {
  const context = useUsuario();

  // 1. Fallback seguro: garante que não haja erros ao iniciar os hooks, mesmo sem contexto ainda
  const usuario = context?.usuario || {
    nome: "",
    especialidade: "",
    bio: "",
    cidade: "",
    visivelNoMapa: false,
    avatarUrl: "",
    latitude: -23.555,
    longitude: -46.67,
  };
  const atualizarUsuario = context?.atualizarUsuario || (() => {});

  // 2. HOOKS NO TOPO: Sempre executam na mesma ordem, respeitando as regras do React
  const [nome, setNome] = useState(usuario.nome);
  const [especialidade, setEspecialidade] = useState(usuario.especialidade);
  const [bio, setBio] = useState(usuario.bio);
  const [cidade, setCidade] = useState(usuario.cidade);
  const [visivelNoMapa, setVisivelNoMapa] = useState(usuario.visivelNoMapa);
  const [modoEdicao, setModoEdicao] = useState(false);

  // Sincroniza se o contexto mudar externamente
  useEffect(() => {
    if (context?.usuario) {
      setNome(context.usuario.nome);
      setEspecialidade(context.usuario.especialidade);
      setBio(context.usuario.bio);
      setCidade(context.usuario.cidade);
      setVisivelNoMapa(context.usuario.visivelNoMapa);
    }
  }, [context?.usuario]);

  // 3. Early return seguro DEPOIS dos hooks
  if (!context) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "#94A3B8" }}>Carregando dados do usuário...</Text>
      </SafeAreaView>
    );
  }

  function salvar() {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome não pode ficar em branco.");
      return;
    }

    // ─── GEOCODING LOCAL (Localização Exata) ───────────────────
    let novaLatitude = usuario.latitude;
    let novaLongitude = usuario.longitude;

    const cidadeLimpa = cidade.toLowerCase().trim();

    // Mapeamento manual de coordenadas para mover o pin no mapa
    if (cidadeLimpa.includes("santos")) {
      novaLatitude = -23.9608; // Latitude exata de Santos, SP
      novaLongitude = -46.3339; // Longitude exata de Santos, SP
    } else if (
      cidadeLimpa.includes("mongaguá") ||
      cidadeLimpa.includes("mongagua")
    ) {
      novaLatitude = -24.0934; // Latitude exata de Mongaguá, SP
      novaLongitude = -46.6214; // Longitude exata de Mongaguá, SP
    } else if (
      cidadeLimpa.includes("são paulo") ||
      cidadeLimpa.includes("sao paulo") ||
      cidadeLimpa.includes("sp")
    ) {
      novaLatitude = -23.5505; // Centro de São Paulo, SP
      novaLongitude = -46.6333;
    } else if (
      cidadeLimpa.includes("rio de janeiro") ||
      cidadeLimpa.includes("rj")
    ) {
      novaLatitude = -22.9068; // Rio de Janeiro, RJ
      novaLongitude = -43.1729;
    }
    // ───────────────────────────────────────────────────────────

    // Salva todas as informações junto com as novas coordenadas atualizadas
    atualizarUsuario({
      nome,
      especialidade,
      bio,
      cidade,
      visivelNoMapa,
      latitude: novaLatitude,
      longitude: novaLongitude,
    });

    setModoEdicao(false);
    Alert.alert(
      "Salvo!",
      `Seu perfil foi atualizado e posicionado em: ${cidade}.`,
    );
  }

  function cancelar() {
    setNome(usuario.nome);
    setEspecialidade(usuario.especialidade);
    setBio(usuario.bio);
    setCidade(usuario.cidade);
    setVisivelNoMapa(usuario.visivelNoMapa);
    setModoEdicao(false);
  }

  const avatarPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome || "Arthere")}&background=EC1B4B&color=fff&size=150`;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Meu Perfil</Text>
          {modoEdicao ? (
            <TouchableOpacity onPress={cancelar}>
              <Text style={styles.btnCancelar}>Cancelar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.btnEditar}
              onPress={() => setModoEdicao(true)}
            >
              <Ionicons name="pencil-outline" size={16} color="#EC1B4B" />
              <Text style={styles.btnEditarTexto}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* ── Avatar ─────────────────────────────────────────── */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: usuario.avatarUrl || avatarPlaceholder }}
                style={styles.avatar}
              />
              {modoEdicao && (
                <TouchableOpacity style={styles.btnTrocarFoto}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            {!modoEdicao && nome ? (
              <Text style={styles.nomeExibido}>{nome}</Text>
            ) : null}
            {!modoEdicao && especialidade ? (
              <Text style={styles.especialidadeExibida}>{especialidade}</Text>
            ) : null}
          </View>

          {/* ── Visibilidade no Mapa ────────────────────────────── */}
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Aparecer no mapa</Text>
                <Text style={styles.switchSub}>
                  {visivelNoMapa
                    ? "Seu perfil está visível para contratantes"
                    : "Você está oculto no mapa"}
                </Text>
              </View>
              <Switch
                value={visivelNoMapa}
                onValueChange={(val) => {
                  setVisivelNoMapa(val);
                  atualizarUsuario({ visivelNoMapa: val });
                }}
                trackColor={{ false: "#E2E8F0", true: "#EC1B4B" }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* ── Campos do perfil ────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Informações</Text>

            <Campo
              label="Nome completo"
              valor={nome}
              onChange={setNome}
              editando={modoEdicao}
              placeholder="Seu nome"
              icone="person-outline"
            />
            <Campo
              label="Especialidade"
              valor={especialidade}
              onChange={setEspecialidade}
              editando={modoEdicao}
              placeholder="Ex: Fotógrafo, DJ, Músico..."
              icone="brush-outline"
            />
            <Campo
              label="Cidade"
              valor={cidade}
              onChange={setCidade}
              editando={modoEdicao}
              placeholder="Ex: São Paulo, SP"
              icone="location-outline"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Sobre mim</Text>
            {modoEdicao ? (
              <TextInput
                style={styles.inputBio}
                value={bio}
                onChangeText={setBio}
                placeholder="Conte um pouco sobre você e seus serviços..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            ) : (
              <Text style={bio ? styles.bioTexto : styles.bioPlaceholder}>
                {bio || "Adicione uma descrição sobre você..."}
              </Text>
            )}
          </View>

          {/* ── Botão Salvar ────────────────────────────────────── */}
          {modoEdicao && (
            <TouchableOpacity style={styles.btnSalvar} onPress={salvar}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
              />
              <Text style={styles.btnSalvarTexto}>Salvar alterações</Text>
            </TouchableOpacity>
          )}

          {/* ── Info do mapa ─────────────────────────────────────── */}
          {!modoEdicao && (
            <View style={styles.infoMapa}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#7C3AED"
              />
              <Text style={styles.infoMapaTexto}>
                Sua posição no mapa é baseada no endereço do seu perfil. O
                marcador mudará automaticamente ao digitar e salvar uma cidade
                mapeada.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Componente de Campo ──────────────────────────────────────────────────────
function Campo({
  label,
  valor,
  onChange,
  editando,
  placeholder,
  icone,
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  editando: boolean;
  placeholder: string;
  icone: string;
}) {
  return (
    <View style={styles.campoWrapper}>
      <Text style={styles.campoLabel}>{label}</Text>
      <View style={[styles.campoRow, editando && styles.campoRowAtivo]}>
        <Ionicons
          name={icone as any}
          size={18}
          color={editando ? "#EC1B4B" : "#94A3B8"}
          style={{ marginRight: 10 }}
        />
        {editando ? (
          <TextInput
            style={styles.campoInput}
            value={valor}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
          />
        ) : (
          <Text style={valor ? styles.campoValor : styles.campoVazio}>
            {valor || placeholder}
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F7FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitulo: { fontSize: 22, fontWeight: "800", color: "#111" },
  btnEditar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EC1B4B",
  },
  btnEditarTexto: { fontSize: 14, fontWeight: "700", color: "#EC1B4B" },
  btnCancelar: { fontSize: 15, fontWeight: "600", color: "#94A3B8" },
  avatarSection: { alignItems: "center", paddingVertical: 24 },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#EC1B4B",
  },
  btnTrocarFoto: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EC1B4B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  nomeExibido: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  especialidadeExibida: { fontSize: 14, color: "#7C3AED", fontWeight: "600" },
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardTitulo: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  switchRow: { flexDirection: "row", alignItems: "center" },
  switchLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 3,
  },
  switchSub: { fontSize: 12, color: "#94A3B8" },
  campoWrapper: { marginBottom: 14 },
  campoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  campoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F8F7FA",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  campoRowAtivo: { borderColor: "#EC1B4B", backgroundColor: "#fff" },
  campoInput: { flex: 1, fontSize: 15, color: "#111" },
  campoValor: { fontSize: 15, color: "#111" },
  campoVazio: { fontSize: 15, color: "#CBD5E1" },
  inputBio: {
    fontSize: 14,
    color: "#111",
    lineHeight: 22,
    minHeight: 100,
    borderWidth: 1.5,
    borderColor: "#EC1B4B",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  bioTexto: { fontSize: 14, color: "#475569", lineHeight: 22 },
  bioPlaceholder: { fontSize: 14, color: "#CBD5E1", fontStyle: "italic" },
  btnSalvar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#EC1B4B",
    shadowColor: "#EC1B4B",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  btnSalvarTexto: { fontSize: 16, fontWeight: "800", color: "#fff" },
  infoMapa: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 4,
    padding: 14,
    backgroundColor: "#F3F0FF",
    borderRadius: 14,
  },
  infoMapaTexto: { flex: 1, fontSize: 13, color: "#7C3AED", lineHeight: 20 },
});
