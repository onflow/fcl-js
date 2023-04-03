const fs = require('fs');
const fse = require('fs-extra');
const os = require("os");

const srcDir = '../fcl/src';
const destDir = './src';

// get ignored files from gitignore
// const ignoreFiles = fs.readFileSync('.gitignore').toString().split('\n').filter(path => path.match(/^!.+\.js$/)).map(path => path.slice(1))
const ignoreFiles = [
  'src/default-config.js',
  'src/current-user/exec-service/exec-local.js',
  'src/current-user/exec-service/strategies/iframe-rpc.js',
  'src/current-user/exec-service/strategies/utils/render-webview.js',
  'src/current-user/exec-service/strategies/utils/webview.js',
  'src/discovery/services.test.js',
]

// don't copy ignored files
fse.copySync(srcDir, destDir, (src, dest) => {
  const shouldCopy = ignoreFiles.every(ignorePath => !src.includes(ignorePath))

  return shouldCopy
})

fs.appendFileSync('./src/fcl.js', `${os.EOL}export {FCLWebView} from "./current-user/exec-service/strategies/utils/webview"${os.EOL}`)
