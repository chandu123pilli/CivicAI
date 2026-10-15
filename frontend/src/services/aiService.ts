import api from './api';
import { AIClassifyResult } from '../types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
  related_issues?: any[];
}

export const aiService = {
  async classify(title: string, description: string): Promise<AIClassifyResult> {
    const res = await api.post<AIClassifyResult>('/ai/classify', { title, description });
    return res.data;
  },

  async chat(message: string, conversationHistory: ChatMessage[] = []): Promise<ChatResponse> {
    const res = await api.post<ChatResponse>('/ai/chat', {
      message,
      conversation_history: conversationHistory,
    });
    return res.data;
  },

  async getSimilar(issueId: number): Promise<any[]> {
    const res = await api.get(`/ai/similar/${issueId}`);
    return res.data;
  },
};
