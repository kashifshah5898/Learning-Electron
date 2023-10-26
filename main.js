const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 890,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  const uploadsDir = path.join(__dirname, "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  mainWindow.loadFile("login.html");

  // Uncomment the following line if you want to open DevTools by default
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

ipcMain.on('username-selected', (event, username) => {
  // Store the username in the main process if needed
  // Redirect to the home page (index.html)
  mainWindow.loadFile('index.html');
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('display-username', username);
  });
});

ipcMain.on('quit-app', () => {
  app.quit();
});