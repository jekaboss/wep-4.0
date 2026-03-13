const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;
let tray = null;

// Path to server.js
const serverPath = path.join(__dirname, 'server.js');
const indexPath = path.join(__dirname, 'index.html');

// Start Node.js server
function startServer() {
  return new Promise((resolve, reject) => {
    serverProcess = spawn('node', [serverPath], {
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
      resolve();
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    serverProcess.on('close', (code) => {
      console.log(`Server exited with code ${code}`);
    });

    // Timeout fallback
    setTimeout(() => resolve(), 3000);
  });
}

// Stop Node.js server
function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'img', 'logo1.webp'),
    title: 'WEP-Blocknot'
  });

  mainWindow.loadFile(indexPath);
  
  // Open DevTools in development
  // mainWindow.webContents.openDevTools();

  // Create system tray
  createTray();
}

// Create system tray icon
function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'img', 'logo1.webp');
  
  tray = new Tray(iconPath);
  tray.setToolTip('WEP-Blocknot - Сервер працює');
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Відкрити WEP-Blocknot', 
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    { 
      label: 'Перезапустити сервер', 
      click: () => {
        stopServer();
        setTimeout(startServer, 1000);
      }
    },
    { type: 'separator' },
    { 
      label: 'Вийти', 
      click: () => {
        stopServer();
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  
  // Click on tray icon opens window
  tray.on('click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

// App ready
app.whenReady().then(async () => {
  await startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Close all windows
app.on('window-all-closed', () => {
  stopServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Cleanup on quit
app.on('before-quit', () => {
  stopServer();
});

// Handle server control from renderer
ipcMain.handle('start-server', async () => {
  await startServer();
  return { success: true };
});

ipcMain.handle('stop-server', () => {
  stopServer();
  return { success: true };
});

ipcMain.handle('check-server', async () => {
  const http = require('http');
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/cheatsheets', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
});
