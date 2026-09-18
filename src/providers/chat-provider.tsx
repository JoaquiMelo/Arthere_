import React, { createContext, useContext, useMemo, useState } from 'react';

import type { AgenteCriativo } from '@/features/agents/types/agent';

export type ChatMessage = { id: string; text: string; sentByMe: boolean; createdAt: Date };
export type Conversation = {
  id: string;
  participant: Pick<AgenteCriativo, 'id' | 'nome' | 'avatarUrl' | 'especialidades' | 'disponivel'>;
  messages: ChatMessage[];
};

type ChatContextType = {
  conversations: Conversation[];
  startConversation: (agent: AgenteCriativo) => string;
  sendMessage: (conversationId: string, text: string) => void;
};

const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const startConversation = (agent: AgenteCriativo) => {
    const existing = conversations.find((conversation) => conversation.participant.id === agent.id);
    if (existing) return existing.id;

    const id = `chat-${agent.id}`;
    setConversations((current) => [{
      id,
      participant: { id: agent.id, nome: agent.nome, avatarUrl: agent.avatarUrl, especialidades: agent.especialidades, disponivel: agent.disponivel },
      messages: [],
    }, ...current]);
    return id;
  };

  const sendMessage = (conversationId: string, text: string) => {
    const message = text.trim();
    if (!message) return;
    setConversations((current) => current.map((conversation) => conversation.id === conversationId
      ? { ...conversation, messages: [...conversation.messages, { id: `${Date.now()}`, text: message, sentByMe: true, createdAt: new Date() }] }
      : conversation));
  };

  const value = useMemo(() => ({ conversations, startConversation, sendMessage }), [conversations]);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => useContext(ChatContext);
