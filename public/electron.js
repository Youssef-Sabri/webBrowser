const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process'); // Used to spawn the backend

let mainWindow;
let serverProcess;

function createServer() {
  // Spawn the backend/server.js as a child process
  const serverPath = path.join(__dirname, '../backend/server.js');
  serverProcess = fork(serverPath);
  
  console.log(`Backend process spawned with PID: ${serverProcess.pid}`);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // Custom frame for your browser UI
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true, // IMPORTANT: Enables the Chromium render engine
    },
  });

  // Load React App (Dev or Production)
  const startUrl = process.env.ELECTRON_START_URL;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => (mainWindow = null));
}

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