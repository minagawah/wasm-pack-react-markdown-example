const path = require('path');
const {
  override,
  overrideDevServer,
  addExternalBabelPlugin,
} = require('customize-cra');

const wasmOutDir = path.resolve(__dirname, 'wasm');

const addWasmHandler = config => {
  config.resolve.extensions.push('.wasm');

  // Exclusion in `file-loader`.
  // If you are NOT using CRA, this is not needed.
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
    use: [
      {
        loader: require.resolve('wasm-loader'),
      },
    ],
  });

  return config;
};

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

module.exports = {
  webpack: override(
    addWasmHandler,
    addExternalBabelPlugin([
      'babel-plugin-bundled-import-meta',
      {
        // You need to specify "bundleDir" if
        // your built WASM directory is different
        // from your Webpack bundle directory.
        //
        // bundleDir: [PUBLIC_PATH_TO_YOUR_BUILT_WASM_DIRECTORY]
        importStyle: 'cjs',
      },
    ]),
    // Just adding an alias '@'.
    config => {
      config.resolve.alias['@'] = path.join(__dirname, 'src');
      return config;
    }
  ),
  devServer: overrideDevServer(devServerConfig),
};
