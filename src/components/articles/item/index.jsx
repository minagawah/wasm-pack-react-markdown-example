import React from 'react';

import './styles.css';

export const Item = ({ renderMarkdown, children }) => {
  return children
    ? (
      <div className="item" dangerouslySetInnerHTML={{
        __html: renderMarkdown(children)
      }} />
    )
    : null;
}
