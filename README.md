# wasm-pack-react-markdown-example

Use wasm-pack to handle markdown in React app

[1. About](#about)  
[2. What I Did](#what)  
&nbsp; [2-1. Essentials](#what-essentials)  
&nbsp; [2-2. Actual Work](#what-actual-work)  
[3. Run](#run)  
[4. LICENSE](#license)  


[screenshot](screenshot.jpg "Screenshot")


<a id="about"></a>
## 1. About

So, we have some issues using WASM these days...

- ***We want multiple WASM modules in our existing front-end apps.***
- Say, the existing app being a React app.
- Mounting WASM to an existing DOM is easy, ***but there are occasions you want to asynchronously import WASM files.***
- ***Sometimes you don't want WASMs to render HTML contents***, but simply want it to process data being passed.
- [wasm-pack-plugin](https://github.com/wasm-tool/wasm-pack-plugin) is nice, ***but it allows us to build only 1 crate per Webpack project.***
- [yew](https://yew.rs/docs/) is nice, ***but it needs a fixed DOM to mount to, and it renders HTML to the mounted DOM.***

and here are the achievements:

- ***Asynchronously loads WASM modules*** in React apps
- ***No fixed mounting points (DOMs)***
- ***Allows multiple WASM modules***
- ***WASM modules simply takes data, returns the process data.*** No HTML rendering.

To illustrate the use, I have a React component importing a WASM module which I named it `markdown-wasm`.  
The react component passes markdown texts, and `markdown-wasm` converts the data to HTML (in strings).  
Note that `markdown-wasm` is just wrapper of [comrak](https://crates.io/crates/comrak).  


<a id="what"></a>
## 2. What I Did


<a id="what-essentials"></a>
### 2-1. Essentials

These are the essential tricks:

- Using [wasm-loader](https://github.com/ballercat/wasm-loader) to load `*.wasm` files
- Use of [@open-wc/webpack-import-meta-loader](https://github.com/open-wc/open-wc/tree/master/packages/webpack-import-meta-loader) to support `import.meta` syntax
- MIME type `application/wasm` for `*.wasm`
- `--target web` when building with [wasm-pack](https://github.com/rustwasm/wasm-pack)
- `yarn link` so that React can lookup the WASM module


<a id="what-actual-work"></a>
### 2-2. Actual Work

For the sample WASM module, I named it `markdown-wasm`. The sources are stored in `/src_for_wasm` directory. Using `build.sh` (which just runs `wasm-pack build`), it builds the sources, and the compiled results WASM files to `/wasm/markdown-wasm`.

1. Creating a new React app using CRA
```
yarn create react-app wasm-pack-react-markdown-example
yarn add react-router-dom
yarn add customize-cra react-app-rewired wasm-loader @open-wc/webpack-import-meta-loader --dev
```
2. Creating a WASM project within
```
mkdir src_for_wasm
cd src_for_wasm
cargo generate --git https://github.com/rustwasm/wasm-pack-template
(when asked for the name, I typed "markdown-wasm")
```
3. Making a build directory ***beforehand***
```
cd public
mkdir markdown-wasm
touch markdown-wasm/.gitignore
```
4. Building a WASM module before making a symlink. It will create `package.json` in there (`yarn link` demands it for the symlink name).
```
sh ./build.sh markdown-wasm
```
5. Making a symlink for "markdown-wasm"
```
cd public/markdown-wasm
# Attempt to register a new symlink "markdown-wasm"
yarn link
cd ../../src
# Making a symlink to "markdown-wasm"
yarn link "markdown-wasm"
# JS can lookup the module now!
```
6. Overriding file loaders and devServer settings
For `customize-cra` requires `config-override.js`.
What I did to override loaders are simple. Please, read `config-override.js`.
Overriding `devServer` was a bit tricky.
There, we print the MIME type `application/wasm` for `*.wasm` files.
Without it, `WebAssembly.instantiateStreaming` throws an error when running in development mode.


*Extra:*  
I have `.env` file, and has `NODE_PATH=src/` in it.  
This is not required, but optional. It simply allows us to import React components, not by relative path, but absolute path.


<a id="run"></a>
## 3. Run

`yarn build:wasm`
This simply runs `sh ./build.sh markdown_element`, and outputs the build to `wasm/markdown_element`.

`yarn start`
Runs a React app in development mode.
http://localhost:3000



<a id="license"></a>
## 4. License

Dual-licensed under either of the followings.  
Choose at your option.

- The UNLICENSE ([LICENSE.UNLICENSE](LICENSE.UNLICENSE))
- MIT license ([LICENSE.MIT](LICENSE.MIT))

`markdown-wasm` is a wrapper of [comrak](https://crates.io/crates/comrak).  
Copyright (c) 2017–2020, Ashe Connor. Licensed under the 2-Clause BSD License.  
cmark itself is is copyright (c) 2014, John MacFarlane.  
See their [LEGAL](https://github.com/kivikakk/comrak/blob/HEAD/COPYING) notes.

