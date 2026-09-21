import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useManagement } from "@/providers/management-provider";
import { useUser } from "@/providers/user-provider";
import { colors } from "@/shared/theme/colors";

const AVATAR_PADRAO = "https://i.pravatar.cc/300?img=68";

// Interface para eventos anteriores
interface EventoAnterior {
  id: string;
  titulo: string;
  data: string;
  imagemUrl: string;
}

// Dados simulados da galeria de eventos anteriores
const MOCK_EVENTOS_ANTERIORES: EventoAnterior[] = [
  {
    id: "1",
    titulo: "Festival Verão de Música",
    data: "Jan 2026",
    imagemUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    titulo: "Desfile Primavera/Verão",
    data: "Nov 2025",
    imagemUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    titulo: "Gala Corporativa 2025",
    data: "Out 2025",
    imagemUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ContratanteProfileScreen() {
  const navigation = useNavigation<any>();
  const { user } = useUser();
  const { vagas } = useManagement();

  const [empresa, setEmpresa] = useState(
    user?.empresa || "Empresa não informada",
  );
  const [editando, setEditando] = useState(false);
  const [rascunhoEmpresa, setRascunhoEmpresa] = useState(empresa);
  const [eventos] = useState<EventoAnterior[]>(MOCK_EVENTOS_ANTERIORES);

  const concluidas = vagas.filter((vaga) => vaga.status === "CONCLUIDA").length;
  const emAndamento = vagas.filter(
    (vaga) => vaga.status === "EM_ANDAMENTO",
  ).length;
  const totalCandidaturas = vagas.reduce(
    (soma, vaga) => soma + vaga.candidatos.length,
    0,
  );

  const abrirEdicao = () => {
    setRascunhoEmpresa(empresa);
    setEditando(true);
  };

  const salvarEmpresa = () => {
    setEmpresa(rascunhoEmpresa.trim() || empresa);
    setEditando(false);
  };

  const avatarSource =
    (user as { avatarUrl?: string; avatar?: string } | null)?.avatarUrl ||
    (user as { avatar?: string } | null)?.avatar ||
    AVATAR_PADRAO;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Capa */}
        <View style={styles.coverContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
            }}
            style={styles.coverImage}
          />
          <View style={styles.coverOverlay} />
          <TouchableOpacity
            style={styles.settingsIcon}
            onPress={() => navigation.navigate("Settings")}
            accessibilityLabel="Abrir configurações"
          >
            <Ionicons name="settings-outline" size={21} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Informações Principais */}
        <View style={styles.intro}>
          <Image source={{ uri: avatarSource }} style={styles.avatar} />
          <Text style={styles.name}>
            {user?.nomeSocial || user?.nome || "Contratante"}
          </Text>

          <TouchableOpacity
            style={styles.empresaBadge}
            onPress={abrirEdicao}
            activeOpacity={0.75}
          >
            <Ionicons name="business" size={14} color={colors.primaryDark} />
            <Text style={styles.empresa}>{empresa}</Text>
            <Ionicons name="pencil" size={12} color={colors.primaryDark} />
          </TouchableOpacity>

          {user?.cidade ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={14} color={colors.orange} />
              <Text style={styles.location}>{user.cidade}</Text>
            </View>
          ) : null}

          {/* Cards de Métricas/Estatísticas */}
          <View style={styles.statsCard}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{vagas.length}</Text>
              <Text style={styles.statLabel}>Vagas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{emAndamento}</Text>
              <Text style={styles.statLabel}>Em andamento</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{concluidas}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
          </View>

          {/* Ações Rápidas */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => navigation.navigate("ManageOpportunities")}
              activeOpacity={0.85}
            >
              <Ionicons name="people" size={16} color={colors.white} />
              <Text style={styles.manageButtonText}>
                Candidaturas{" "}
                {totalCandidaturas > 0 ? `(${totalCandidaturas})` : ""}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => navigation.navigate("EditContractorProfile")}
              activeOpacity={0.85}
            >
              <Ionicons
                name="create-outline"
                size={16}
                color={colors.primaryDark}
              />
              <Text style={styles.editProfileButtonText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SEÇÃO: Eventos Anteriores Realizados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="images-outline"
                size={18}
                color={colors.primaryDark}
              />
              <Text style={styles.sectionTitle}>Eventos anteriores</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              {eventos.length} fotos salvas
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryContainer}
          >
            {eventos.map((evento) => (
              <View key={evento.id} style={styles.eventCard}>
                <Image
                  source={{ uri: evento.imagemUrl }}
                  style={styles.eventImage}
                />
                <View style={styles.eventOverlay}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {evento.titulo}
                  </Text>
                  <View style={styles.eventDateBadge}>
                    <Ionicons
                      name="calendar-outline"
                      size={10}
                      color={colors.white}
                    />
                    <Text style={styles.eventDateText}>{evento.data}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Card para Adicionar Novo Evento */}
            <TouchableOpacity style={styles.addEventCard} activeOpacity={0.75}>
              <View style={styles.addEventIconCircle}>
                <Ionicons name="add" size={22} color={colors.primaryDark} />
              </View>
              <Text style={styles.addEventText}>Adicionar evento</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* SEÇÃO: Minhas Vagas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons
                name="briefcase-outline"
                size={18}
                color={colors.primaryDark}
              />
              <Text style={styles.sectionTitle}>Minhas vagas</Text>
            </View>
          </View>

          {vagas.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons
                name="folder-open-outline"
                size={36}
                color={colors.muted}
              />
              <Text style={styles.emptyText}>
                Você ainda não publicou nenhuma vaga.
              </Text>
            </View>
          ) : (
            vagas.map((vaga) => (
              <TouchableOpacity
                key={vaga.id}
                style={styles.vagaCard}
                onPress={() => navigation.navigate("ManageOpportunities")}
                activeOpacity={0.75}
              >
                <View style={styles.flex1}>
                  <Text style={styles.vagaTitulo}>{vaga.titulo}</Text>
                  <Text style={styles.vagaMeta}>
                    {vaga.categoria} · {vaga.candidatos.length} candidato
                    {vaga.candidatos.length === 1 ? "" : "s"}
                  </Text>
                </View>
                <View style={styles.vagaRight}>
                  <Text style={styles.statusBadge}>
                    {vaga.status === "CONCLUIDA" ? "Concluída" : "Ativa"}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.muted}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal Edição Rápida da Empresa */}
      <Modal
        visible={editando}
        animationType="fade"
        transparent
        onRequestClose={() => setEditando(false)}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Editar nome da empresa</Text>
            <TextInput
              style={styles.editInput}
              value={rascunhoEmpresa}
              onChangeText={setRascunhoEmpresa}
              placeholder="Ex.: Vitrine Eventos"
              placeholderTextColor={colors.muted}
            />
            <View style={styles.editActions}>
              <TouchableOpacity onPress={() => setEditando(false)}>
                <Text style={styles.cancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={salvarEmpresa}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 45 },

  // Capa & Header
  coverContainer: {
    height: 160,
    overflow: "hidden",
    backgroundColor: colors.secondary,
    position: "relative",
  },
  coverImage: { width: "100%", height: "100%" },
  coverOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(20, 42, 45, 0.3)",
  },
  settingsIcon: {
    position: "absolute",
    top: 14,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  // Perfil Principal
  intro: { alignItems: "center", paddingHorizontal: 20 },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    marginTop: -52,
    borderWidth: 4,
    borderColor: colors.white,
  },
  name: { marginTop: 10, color: colors.text, fontSize: 22, fontWeight: "900" },

  empresaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  empresa: { color: colors.primaryDark, fontSize: 13, fontWeight: "800" },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 7,
  },
  location: { color: colors.muted, fontSize: 13, fontWeight: "600" },

  // Card de Métricas
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  stat: { flex: 1, alignItems: "center" },
  statNumber: { color: colors.text, fontSize: 19, fontWeight: "900" },
  statLabel: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  statDivider: { width: 1, height: 26, backgroundColor: colors.border },

  // Ações
  actionButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    width: "100%",
  },
  manageButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: colors.primaryDark,
  },
  manageButtonText: { color: colors.white, fontWeight: "800", fontSize: 13 },
  editProfileButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    backgroundColor: colors.white,
  },
  editProfileButtonText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "800",
  },

  // Seções Gerais
  section: { marginTop: 26, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "900" },
  sectionSubtitle: { color: colors.muted, fontSize: 12 },

  // Galeria de Eventos Anteriores
  galleryContainer: { gap: 12, paddingRight: 20 },
  eventCard: {
    width: 155,
    height: 190,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.secondary,
  },
  eventImage: { width: "100%", height: "100%" },
  eventOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  eventTitle: { color: colors.white, fontSize: 12, fontWeight: "800" },
  eventDateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  eventDateText: { color: colors.white, fontSize: 10, opacity: 0.9 },

  addEventCard: {
    width: 120,
    height: 190,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 10,
  },
  addEventIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  addEventText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },

  // Lista de Vagas
  emptyStateContainer: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: { color: colors.muted, fontSize: 13, textAlign: "center" },
  vagaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  flex1: { flex: 1 },
  vagaTitulo: { color: colors.text, fontWeight: "800", fontSize: 14 },
  vagaMeta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  vagaRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryDark,
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  editCard: { backgroundColor: colors.white, borderRadius: 18, padding: 20 },
  editTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },
  editInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    fontSize: 14,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 18,
    marginTop: 18,
  },
  cancel: { color: colors.muted, fontWeight: "700", fontSize: 14 },
  save: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveText: { color: colors.white, fontWeight: "800", fontSize: 14 },
});
