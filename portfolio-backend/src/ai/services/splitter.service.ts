import { randomUUID } from 'crypto';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ParsedDocument } from '../interfaces/document.interface';
import { DocumentChunk } from '../interfaces/chunk.interface';

@Injectable()
export class SplitterService {
    private readonly splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  async split(document: ParsedDocument): Promise<DocumentChunk[]> {
    const docs = await this.splitter.createDocuments([
      document.content,
    ]);

    return docs.map((doc, index) => ({
      id: randomUUID(),

      content: doc.pageContent,

      metadata: {
        source: document.fileName,
        chunkIndex: index,
      },
    }));
  }
}