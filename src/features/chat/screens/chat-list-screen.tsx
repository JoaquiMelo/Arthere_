import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useChat, type Conversation } from '@/providers/chat-provider';
import { colors } from '@/shared/theme/colors';

function preview(conversation: Conversation) {
  const last = conversation.messages.at(-1);
  return last ? `${last.sentByMe ? 'Você: ' : ''}${last.text}` : 'Toque para iniciar uma conversa';
}

export default function ChatListScreen() {
  const navigation = useNavigation<any>();
  const { conversations } = useChat();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Mensagens</Text><Text style={styles.subtitle}>Suas últimas conversas</Text></View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={conversations.length ? styles.list : styles.empty}
        ListEmptyComponent={<View style={styles.emptyContent}><View style={styles.emptyIcon}><Ionicons name="chatbubbles-outline" size={30} color={colors.primary} /></View><Text style={styles.emptyTitle}>Nenhuma conversa ainda</Text><Text style={styles.emptyText}>No mapa, escolha um profissional e toque no ícone de mensagem para começar.</Text></View>}
        renderItem={({ item }) => <ConversationRow conversation={item} onPress={() => navigation.navigate('ChatConversation', { conversationId: item.id })} />}
      />
    </SafeAreaView>
  );
}

function ConversationRow({ conversation, onPress }: { conversation: Conversation; onPress: () => void }) {
  const last = conversation.messages.at(-1);
  return <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.75}>
    <View><Image source={{ uri: conversation.participant.avatarUrl }} style={styles.avatar} />{conversation.participant.disponivel && <View style={styles.online} />}</View>
    <View style={styles.rowContent}><View style={styles.rowTop}><Text style={styles.name}>{conversation.participant.nome}</Text>{last && <Text style={styles.time}>{last.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>}</View><Text style={styles.preview} numberOfLines={1}>{preview(conversation)}</Text></View>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14 }, title: { color: colors.text, fontSize: 25, fontWeight: '800' }, subtitle: { color: colors.muted, fontSize: 13, marginTop: 3 }, list: { paddingHorizontal: 16 }, row: { minHeight: 78, flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12 }, avatar: { width: 52, height: 52, borderRadius: 26 }, online: { position: 'absolute', right: 0, bottom: 1, width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.background }, rowContent: { flex: 1 }, rowTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, name: { color: colors.text, fontSize: 15, fontWeight: '800', flex: 1 }, time: { color: colors.muted, fontSize: 11 }, preview: { color: colors.muted, fontSize: 13, marginTop: 5 }, empty: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 36 }, emptyContent: { alignItems: 'center' }, emptyIcon: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceStrong }, emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 16 }, emptyText: { color: colors.muted, textAlign: 'center', lineHeight: 20, marginTop: 8, fontSize: 13 },
});
