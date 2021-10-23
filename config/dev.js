const path = require('path');
const { spawn } = require('child_process');
const electron = require('electron');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const mainWebpackConfig = require('./webpack.main');
const rendererWebpackConfig = require('./webpack.renderer');

function buildMain() {
  return new Promise((resolve, reject) => {
    const compiler = webpack(mainWebpackConfig);

    compiler.watch({}, (err, stats) => {
      if (err) {
        reject(err);
      }
      console.log(stats);
      resolve();
    });
  });
}

function buildRenderer() {
  const compiler = webpack(rendererWebpackConfig);
  const devServerOptions = {
    ...rendererWebpackConfig.devServer,
  };

  const server = new WebpackDevServer(devServerOptions, compiler);
  server.startCallback(() => {
    console.log(`Starting server on http://localhost:${devServerOptions.port}`);
  });
}

function launch() {
  const args = [path.resolve(process.cwd(), 'dist/main.js')];
  const mainProcess = spawn(electron, args);
  mainProcess.on('close', () => {
    process.exit();
  });
}

buildRenderer();
buildMain().then(() => {
  launch();
});