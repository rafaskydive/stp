/* eslint strict: 0 */
'use strict';

const electron = require('electron');
const app = electron.app; // require('app');

const BrowserWindow = electron.BrowserWindow; // require('browser-window');

// report crashes to the Electron project
// require('crash-reporter').start();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null;
}

function isDevelopment() {
  return process.env.ELECTRON_ENV === 'development'
}

function createMainWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 600,
    frame: true
  });

  // Remove 'public' part when deploying
  const URL = isDevelopment() ? `file://${__dirname}/public/index.html` : `file://${__dirname}/index.html`
  win.loadURL(URL)
  win.openDevTools();
  win.on('closed', onClosed);

  return win;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate-with-no-open-windows', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
});
