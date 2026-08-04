import { randomUUID } from 'crypto';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ParsedDocument } from '../interfaces/document.interface';
import { DocumentChunk } from '../interfaces/chunk.interface';

@Injectable()
export class SplitterService {
  private readonly splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,
    chunkOverlap: 80,
  });

  async split(document: ParsedDocument, originalFileName: string,): Promise<DocumentChunk[]> {
    try {
      const docs = await this.splitter.createDocuments([
        document.content,
      ]);

      const filteredDocs = docs.filter((doc) => {
        const content = doc.pageContent.trim();

        // Remove very small chunks
        if (content.length < 80) {
          return false;
        }

        // Remove chunks with very few words
        if (content.split(/\s+/).length < 10) {
          return false;
        }

        return true;
      });

      return filteredDocs.map((doc, index) => ({
        id: randomUUID(),

        content: doc.pageContent,

        metadata: {
          source: originalFileName,

          storedFileName: document.fileName,

          chunkIndex: index,

          documentType: this.getDocumentType(
            originalFileName,
          ),

          uploadedAt: new Date().toISOString(),
        },
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to split document.',
      );
    }
  }
  private getDocumentType(fileName: string): string {
    const name = fileName.toLowerCase();

    if (name.includes('resume'))
      return 'resume';

    if (name.includes('project'))
      return 'project';

    if (name.includes('certificate'))
      return 'certificate';

    if (name.includes('experience'))
      return 'experience';

    return 'general';
  }
}