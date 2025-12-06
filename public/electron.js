const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') });

let mainWindow;
let serverProcess;

function createServer() {
  // Spawn the backend/server.js as a child process
  const serverPath = path.join(__dirname, '../Backend/server.js');
  serverProcess = fork(serverPath);

  console.log(`Backend process spawned with PID: ${serverProcess.pid}`);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // Custom frame for your browser UI
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true, // IMPORTANT: Enables the Chromium render engine
    },
  });

  // Load React App (Dev or Production)
  const startUrl = process.env.ELECTRON_START_URL;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => (mainWindow = null));
}

const { ipcMain } = require('electron');

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

app.on('ready', () => {
  createServer(); // Start backend
  createWindow(); // Start UI
});

// Kill backend when app closes
app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});