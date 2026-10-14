import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';

import { GoogleGenAI } from '@google/genai';

import { GEMINI_CLIENT } from '../../common/constants/ai.constants';

import {
    ConversationMessage,
} from './conversation.service';

@Injectable()
export class QueryRewriterService {

    constructor(
        @Inject(GEMINI_CLIENT)
        private readonly gemini: GoogleGenAI,
    ) { }

    async rewrite(
        question: string,
        history: ConversationMessage[],
    ): Promise<string> {

        // No history means no rewriting is required.
        if (history.length === 0) {
            return question;
        }

        try {
            const historyText =
                history
                    .map(
                        (message) =>
                            `${message.role}: ${message.content}`,
                    )
                    .join('\n');

            const prompt = `
You are a query rewriting component for a portfolio RAG chatbot.

Your job is to rewrite the user's latest question into a standalone
search query using the conversation history.

IMPORTANT:
The rewritten query must preserve the MAIN TOPIC, TECHNOLOGY,
FRAMEWORK, PROJECT, PERSON, or SUBJECT being discussed immediately
before the latest question.

Rules:

1. Preserve the user's original intent exactly.

2. Resolve references such as:
   - he
   - his
   - it
   - that
   - this
   - they
   - what about
   - how many
   - when
   - where
   - why
   - which

3. If the latest question is a follow-up question, identify what
   entity/topic the previous question was about and carry that topic
   into the rewritten query.

4. NEVER replace a specific technology, framework, project, skill,
   or topic with a broader concept.

   Example:
   Previous: "Does Abhijeet know Angular?"
   Latest: "How many years?"
   Correct:
   "How many years of experience does Abhijeet have with Angular?"

   INCORRECT:
   "How many years of experience does Abhijeet have as a Full-Stack Developer?"

5. Another example:

   Previous: "Does Abhijeet know NestJS?"
   Latest: "How long has he used it?"
   Correct:
   "How long has Abhijeet used NestJS?"

6. Another example:

   Previous: "Tell me about the Swayamsevak Platform."
   Latest: "What technologies were used?"
   Correct:
   "What technologies were used in the Swayamsevak Platform?"

7. Another example:

   Previous: "Does Abhijeet know Angular?"
   Latest: "What about React?"
   Correct:
   "Does Abhijeet know React?"

8. If the latest question is already standalone, return it unchanged.

9. Do NOT answer the question.

10. Do NOT add information that is not present in the conversation.

11. Do NOT infer a broader topic when a specific topic is available.

12. Prefer the MOST RECENT relevant topic when resolving ambiguous
    follow-up questions.

13. Return ONLY the rewritten question.
Do not include explanations, labels, quotes, or markdown.

Conversation history:
${historyText}

Latest user question:
${question}

Standalone search query:
`;

            //             const prompt = `
            // You are a query rewriting component for a portfolio RAG chatbot.

            // Your job is to rewrite the user's latest question into a
            // standalone search query using the conversation history.

            // Rules:
            // 1. Preserve the user's original intent.
            // 2. Resolve references such as:
            //    - he
            //    - his
            //    - it
            //    - that
            //    - this
            //    - they
            // 3. Include important context from previous messages when necessary.
            // 4. Do NOT answer the question.
            // 5. Do NOT add information that is not present in the conversation.
            // 6. If the question is already standalone, return it unchanged.
            // 7. Return ONLY the rewritten question.

            // Conversation history:
            // ${historyText}

            // Latest user question:
            // ${question}

            // Standalone search query:
            // `;

            const response =
                await this.gemini.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

            const rewrittenQuestion = response.text
                ?.trim()
                .replace(/^["'`]+|["'`]+$/g, '')
                .replace(/^(?:standalone search query|rewritten question|question)\s*:\s*/i, '')
                .trim();

            if (!rewrittenQuestion) {
                return question;
            }

            return rewrittenQuestion;

        } catch (error) {
            console.error(
                'Query rewriting failed:',
                error,
            );

            // Important:
            // If rewriting fails, continue with the
            // original question instead of breaking RAG.
            return question;
        }
    }
}