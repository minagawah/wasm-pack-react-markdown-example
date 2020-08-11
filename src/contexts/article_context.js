import React, { useReducer, useCallback, createContext } from 'react';

const initialState = {
  data: [],
};

const MOCK_ARTICLES = [
  `## Server-Fetched Content
### markdown-wasm
- Just a wrapper of [comrak](https://crates.io/crates/comrak).
- Use \`dangerouslySetInnerHTML\` in your React app.
- **Hope you like it**`
];

const mockArticles = () => new Promise(resolve => {
  setTimeout(() => {
    resolve(MOCK_ARTICLES);
  }, 200);
});

const reducer = (state, action) => {
  switch (action.type) {
  case 'RELOADED': {
    return {
      data: [...state.data, ...action.payload]
    };
  }
  default:
    throw new Error();
  }
};

export const ArticleContext = createContext();

export const ArticleContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatchProxy = useCallback(async action => {
    switch (action.type) {
    case 'RELOAD_ARTICLES': {
      const payload = await mockArticles();
      dispatch({ type: 'RELOADED', payload });
      break;
    }
    default:
      dispatch(action);
    }
  }, []);

  return (
    <ArticleContext.Provider value={[state, dispatchProxy]}>
      {props.children}
    </ArticleContext.Provider>
  );
};

