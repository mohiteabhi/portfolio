export interface EmbeddedChunk {
  id: string;

  content: string;

  embedding: number[];

  metadata: {
    source: string;
    chunkIndex: number;
  };
}