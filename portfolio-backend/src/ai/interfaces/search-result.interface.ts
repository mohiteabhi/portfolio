export interface SearchResult {
  id: string;

  content: string;

  distance: number;

  source: string;

  storedFileName: string;

  chunkIndex: number;

  documentType: string;

  uploadedAt: string;
}