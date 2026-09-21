import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useChat } from "@/providers/chat-provider";
import { colors } from "@/shared/theme/colors";

export default function ChatConversationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { conversations, sendMessage } = useChat();
  const [draft, setDraft] = useState("");
  const conversation = conversations.find(
    (item) => item.id === route.params?.conversationId,
  );

  if (!conversation) return null;
  const submit = () => {
    sendMessage(conversation.id, draft);
    setDraft("");
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={10}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={25} color={colors.text} />
          </TouchableOpacity>
          <Image
            source={{ uri: conversation.participant.avatarUrl }}
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{conversation.participant.nome}</Text>
            <Text style={styles.status}>
              {conversation.participant.disponivel
                ? "Disponível agora"
                : "Offline"}
            </Text>
          </View>
        </View>
        <FlatList
          data={conversation.messages}
          keyExtractor={(item) => item.id}
          style={styles.flex}
          contentContainerStyle={
            conversation.messages.length ? styles.messages : styles.empty
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Envie uma mensagem para iniciar a conversa com{" "}
              {conversation.participant.nome}.
            </Text>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.sentByMe ? styles.sent : styles.received,
              ]}
            >
              <Text style={[styles.message, item.sentByMe && styles.sentText]}>
                {item.text}
              </Text>
            </View>
          )}
        />
        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Escreva uma mensagem"
            placeholderTextColor={colors.muted}
            multiline
          />
          <TouchableOpacity
            style={[styles.send, !draft.trim() && styles.sendDisabled]}
            onPress={submit}
            disabled={!draft.trim()}
            accessibilityLabel="Enviar mensagem"
          >
            <Ionicons name="send" size={19} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    height: 66,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { width: 38, height: 42, justifyContent: "center" },
  avatar: { width: 38, height: 38, borderRadius: 19 },
  headerInfo: { marginLeft: 10 },
  name: { color: colors.text, fontSize: 15, fontWeight: "800" },
  status: { color: colors.primary, fontSize: 11, marginTop: 2 },
  messages: { padding: 16, gap: 8, justifyContent: "flex-end", flexGrow: 1 },
  empty: { flexGrow: 1, justifyContent: "center", padding: 34 },
  emptyText: { color: colors.muted, textAlign: "center", lineHeight: 20 },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 15,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: colors.primaryDark,
    borderBottomRightRadius: 3,
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceStrong,
    borderBottomLeftRadius: 3,
  },
  message: { color: colors.text, fontSize: 14, lineHeight: 19 },
  sentText: { color: colors.white },
  typingBubble: { marginTop: 4 },
  typingText: { color: colors.muted, fontSize: 13, fontStyle: "italic" },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 9,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    borderRadius: 21,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 14,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.danger,
  },
  sendDisabled: { opacity: 0.45 },
});
