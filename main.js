const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');

let terminal;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false 
    }
  });

  win.loadFile('index.html');

  terminal = spawn('cmd'); 

  terminal.stdout.on('data', (data) => {
    win.webContents.send('terminal-output', data.toString());
  });

  terminal.stderr.on('data', (data) => {
    win.webContents.send('terminal-output', data.toString());
  });

  terminal.on('exit', () => {
    win.webContents.send('terminal-output', 'Terminal closed');
  });

  ipcMain.on('terminal-input', (event, command) => {
    terminal.stdin.write(command + '\n');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
