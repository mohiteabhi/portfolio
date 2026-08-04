export interface DocumentChunk {
  id: string;

  content: string;

  metadata: {
    source: string;

    storedFileName: string;

    chunkIndex: number;

    documentType: string;

    uploadedAt: string;
  };
}