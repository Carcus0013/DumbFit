const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Only if you're not using preload.js
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
const win = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, 'icon.ico'),  
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });