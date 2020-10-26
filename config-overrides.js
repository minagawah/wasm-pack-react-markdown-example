const path = require('path');
const {
  override,
  overrideDevServer,
  addExternalBabelPlugin,
} = require('customize-cra');

const wasmOutDir = path.resolve(__dirname, 'wasm');

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

  // Exclude from `file-loader`.
  // Though, this is not needed if you are NOT using CRA.
  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(o => {
      if (o.loader && o.loader.indexOf('file-loader') >= 0) {
        o.exclude.push(/\.wasm$/);
      }
    });
  });
  
  config.module.rules.push({
    test: /\.wasm$/,
    include: wasmOutDir,
    use: [{
      loader: require.resolve('wasm-loader'),
    }],
  });
  
  return config;
};


module.exports = {
  webpack: override(
    addWasmHandler,
    addExternalBabelPlugin([
      'babel-plugin-bundled-import-meta',
      {
        // You need to specify "bundleDir"
        // if your built WASM directory
        // is different from your bundle directory.
        // --------------------------------------------------
        // bundleDir: [PUBLIC_PATH_TO_YOUR_BUILT_WASM_DIRECTORY]
        // --------------------------------------------------
        importStyle: 'cjs',
      }
    ]),
  ),
  devServer: overrideDevServer(
    devServerConfig
  ),
}
