const { override, overrideDevServer } = require('customize-cra');
const path = require('path');

const wasmDir = path.resolve(__dirname, 'wasm');

// https://github.com/webpack/webpack-dev-middleware/issues/229#issuecomment-418202278
const devServerConfig = config => ({
  ...config,
  before: app => {
    app.get('*.wasm', (req, res, next) => {
      const options = {
        root: path.resolve(__dirname),
        dotfiles: 'deny',
        headers: {
          'Content-Type': 'application/wasm',
        },
      };
      res.sendFile(req.url, options, err => {
        if (err) {
          console.warn(err);
          next(err);
        }
      });
    });
  },
});
  
const addWasmHandler = config => {
  config.resolve.extensions.push('.wasm');

  // Exclude from `file-loader`
  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(o => {
      if (o.loader && o.loader.indexOf('file-loader') >= 0) {
        o.exclude.push(/\.wasm$/);
      }
    });
  });
  
  config.module.rules.push({
    test: /\.wasm$/,
    use: [{
      loader: require.resolve('wasm-loader'),
    }],
    include: wasmDir,
  });
  
  // Support for `import.meta` syntax.
  config.module.rules.push({
    test: /\.js$/,
    use: [{
      loader: require.resolve('@open-wc/webpack-import-meta-loader'),
    }],
    include: wasmDir,
  });
  
  return config;
};

module.exports = {
  webpack: override(
    addWasmHandler
  ),
  devServer: overrideDevServer(
    devServerConfig
  ),
};

