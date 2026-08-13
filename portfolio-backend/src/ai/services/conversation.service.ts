import { Injectable } from '@nestjs/common';

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
}

@Injectable()
export class ConversationService {
    private readonly conversations =
        new Map<string, ConversationMessage[]>();

    private readonly MAX_MESSAGES = 10;

    getHistory(sessionId: string): ConversationMessage[] {
        return this.conversations.get(sessionId) ?? [];
    }

    addUserMessage(
        sessionId: string,
        content: string,
    ): void {
        this.addMessage(sessionId, {
            role: 'user',
            content,
        });
    }

    addAssistantMessage(
        sessionId: string,
        content: string,
    ): void {
        this.addMessage(sessionId, {
            role: 'assistant',
            content,
        });
    }

    clearHistory(sessionId: string): void {
        this.conversations.delete(sessionId);
    }

    private addMessage(
        sessionId: string,
        message: ConversationMessage,
    ): void {
        const history =
            this.conversations.get(sessionId) ?? [];

        history.push(message);

        // Keep only the latest messages
        if (history.length > this.MAX_MESSAGES) {
            history.splice(
                0,
                history.length - this.MAX_MESSAGES,
            );
        }

        this.conversations.set(
            sessionId,
            history,
        );
    }
}