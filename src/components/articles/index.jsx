import React, { useState, useEffect, useContext } from 'react';
import init, { render_markdown } from 'markdown-wasm';

import { ArticleContext } from '@/contexts/article_context';
import { Loading } from '@/components/loading';

import { Item } from './item';

const anotherContent = `## Static Content
- Not server fetched, but it is hard-coded within the code.`;

export const Articles = () => {
  const [articles, dispatch] = useContext(ArticleContext);
  const [moduleLoading, setModuleLoading] = useState(false);
  const [moduleReady, setModuleReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: 'RELOAD_ARTICLES' });
        setModuleLoading(true);
        await init();
        setModuleReady(true);
      } catch (err) {
        console.error(err);
        setModuleLoading(false);
      }
    })();
  }, [dispatch]);

  return (
    <div>
      {moduleReady && articles.data.length ? (
        <>
          <Item renderMarkdown={render_markdown}>{articles.data[0]}</Item>
          <Item renderMarkdown={render_markdown}>{anotherContent}</Item>
        </>
      ) : (
        <Loading loading={moduleLoading} />
      )}
    </div>
  );
};
