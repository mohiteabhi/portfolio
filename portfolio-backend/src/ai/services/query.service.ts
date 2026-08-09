import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryService {

  normalize(question: string): string {
    let normalized = question.trim();

    normalized = normalized.replace(
      /\bhe\b/gi,
      'Abhijeet',
    );

    normalized = normalized.replace(
      /\bhis\b/gi,
      "Abhijeet's",
    );

    normalized = normalized.replace(
      /\bhim\b/gi,
      'Abhijeet',
    );

    return normalized;
  }
}