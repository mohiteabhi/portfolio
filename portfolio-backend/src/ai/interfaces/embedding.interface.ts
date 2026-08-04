export interface EmbeddedChunk {
  id: string;

  content: string;

  embedding: number[];

  metadata: {
    source: string;

    storedFileName: string;

    chunkIndex: number;

    documentType: string;

    uploadedAt: string;
  };
}