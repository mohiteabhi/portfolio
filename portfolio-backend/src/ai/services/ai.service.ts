import { GoogleGenAI } from '@google/genai';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Express } from 'express';
import { GEMINI_CLIENT } from 'src/common/constants/ai.constants';
import { DocumentService } from './document.service';
import { SplitterService } from './splitter.service';
import { IndexService } from './index.service';
import { SearchService } from './search.service';
import { VectorStoreService } from './vector-store.service';
import { ChatService } from './chat.service';
import { ConversationService } from './conversation.service';
import { QueryRewriterService } from './query-rewriter.service';
@Injectable()
export class AiService {

    constructor(
        @Inject(GEMINI_CLIENT)
        private readonly gemini: GoogleGenAI,
        private readonly documentService: DocumentService,

        private readonly splitterService: SplitterService,
        private readonly indexService: IndexService,
        private readonly searchService: SearchService,
        private readonly vectorStoreService: VectorStoreService,
        private readonly chatService: ChatService,
        private readonly conversationService: ConversationService,
        private readonly queryRewriterService: QueryRewriterService
    ) { }

    getHealth() {
        return {
            success: true,
            service: 'Portfolio AI backend',
            status: 'Running',
            timestamp: new Date().toISOString(),
        }
    }

    async testLLM() {
        try {
            const response = await this.gemini.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: 'Reply only with: Gemini connection successful.',
            });
            return {
                success: true,
                response: response.text,
            };
        }
        catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to connect to Gemini',);
        }
    }

    async parseDocument(fileName: string) {
        try {
            const document = await this.documentService.loadDocument(fileName);

            const chunks = await this.splitterService.split(document, fileName);

            return {
                success: true,
                totalChunks: chunks.length,
                chunks,
            };
        } catch (error) {
            console.error(error);

            throw new InternalServerErrorException(
                'Failed to parse document.',
            );
        }
    }

    async indexDocument(fileName: string, originalFileName: string,) {
        return await this.indexService.indexDocument(
            fileName,
            originalFileName,
        );
    }

    async collectionInfo() {
        return await this.indexService.collectionInfo();
    }

    async search(question: string) {
        return await this.searchService.search(
            question,
        );
    }

    async clearCollection() {
        return await this.vectorStoreService.clearCollection();
    }

    // async chat(
    //     question: string,
    //     sessionId = 'portfolio-demo',
    // ) {
    //     try {
    //         // 1. Get previous conversation
    //         const history =
    //             this.conversationService.getHistory(
    //                 sessionId,
    //             );

    //         // 2. Rewrite the user's question
    //         const searchQuestion =
    //             await this.queryRewriterService.rewrite(
    //                 question,
    //                 history,
    //             );

    //         console.log(
    //             'Original question:',
    //             question,
    //         );

    //         console.log(
    //             'Rewritten question:',
    //             searchQuestion,
    //         );

    //         // 3. Generate the actual chatbot answer
    //         const result =
    //             await this.chatService.chat(
    //                 searchQuestion,
    //             );

    //         // 4. Store conversation
    //         this.conversationService.addUserMessage(
    //             sessionId,
    //             question,
    //         );

    //         this.conversationService.addAssistantMessage(
    //             sessionId,
    //             result.answer!,
    //         );

    //         return result;

    //     } catch (error) {
    //         console.error(error);

    //         throw new InternalServerErrorException(
    //             'Failed to process chatbot question.',
    //         );
    //     }
    // }
    async chat(
        question: string,
        sessionId = 'portfolio-demo',
    ) {
        try {
            const normalizedSessionId = sessionId.trim() || 'portfolio-demo';

            // 1. Read history before adding the current question.
            const history = this.conversationService.getHistory(
                normalizedSessionId,
            );

            console.log('Session ID:', sessionId);
            console.log('History length:', history.length);
            console.log(
                'History:',
                JSON.stringify(history, null, 2),
            );
            // 2. Rewrite follow-up questions using previous turns.
            const searchQuestion = await this.queryRewriterService.rewrite(
                question,
                history,
            );

            console.log('Session ID:', normalizedSessionId);
            console.log('Original question:', question);
            console.log('Rewritten question:', searchQuestion);

            // 3. Save the user's original question before generating
            // the answer, so the conversation remains in order.
            this.conversationService.addUserMessage(
                normalizedSessionId,
                question,
            );

            // 4. Retrieve context and generate the answer.
            const result = await this.chatService.chat(searchQuestion);

            // 5. Save the assistant answer only when one exists.
            if (result.answer) {
                this.conversationService.addAssistantMessage(
                    normalizedSessionId,
                    result.answer,
                );
            }

            return result;
        } catch (error) {
            console.error('Chat processing failed:', error);

            throw new InternalServerErrorException(
                'Failed to process chatbot question.',
            );
        }
    }
}
