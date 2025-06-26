import { supabase } from '@/lib/supabaseClient';
import OpenAI from 'openai';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sessionId: string;
}

export interface Suggestion {
  id: string;
  text: string;
  category: string;
}

export class AssistantService {
  private openai: OpenAI;
  private sessionId: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    this.sessionId = crypto.randomUUID();
  }

  async sendMessage(content: string): Promise<Message> {
    try {
      // Sauvegarder le message de l'utilisateur
      const userMessage = await this.saveMessage({
        role: 'user',
        content,
        sessionId: this.sessionId,
      });

      // Obtenir la réponse de l'assistant
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant marketing spécialisé dans l'analyse des tendances et la création de contenu viral. Aide l'utilisateur à identifier les opportunités et à créer du contenu engageant."
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      // Sauvegarder la réponse de l'assistant
      const assistantMessage = await this.saveMessage({
        role: 'assistant',
        content: completion.choices[0].message.content || '',
        sessionId: this.sessionId,
      });

      return assistantMessage;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }

  private async saveMessage({ role, content, sessionId }: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const { data, error } = await supabase
      .from('assistant_messages')
      .insert([
        {
          role,
          content,
          session_id: sessionId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      role: data.role,
      content: data.content,
      timestamp: data.timestamp,
      sessionId: data.session_id,
    };
  }

  async getMessageHistory(): Promise<Message[]> {
    const { data, error } = await supabase
      .from('assistant_messages')
      .select('*')
      .eq('session_id', this.sessionId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return data.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
      sessionId: message.session_id,
    }));
  }

  async getSuggestions(context: string): Promise<Suggestion[]> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Génère 3 suggestions de questions pertinentes basées sur le contexte de la conversation. Format: JSON array avec {id, text, category}"
          },
          {
            role: "user",
            content: context
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      const suggestions = JSON.parse(completion.choices[0].message.content || '[]');
      return suggestions;
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions:', error);
      return [];
    }
  }
} 