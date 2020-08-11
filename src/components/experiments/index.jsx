import React from 'react';

import { ArticleContextProvider } from 'contexts/article_context';
import { Articles } from 'components/articles';

export const Experiments = () => (
  <ArticleContextProvider>
    <h2>Experiments</h2>
    <Articles />
  </ArticleContextProvider>
);
