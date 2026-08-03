import { Provider } from '@nestjs/common';
import { ChromaClient } from 'chromadb';

import { CHROMA_CLIENT } from '../../common/constants/chroma.constants';

export const ChromaProvider: Provider = {
  provide: CHROMA_CLIENT,

  useFactory: () => {
    return new ChromaClient({
      path: 'http://localhost:8000',
    });
  },
};