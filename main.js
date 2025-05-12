const { app, BrowserWindow } = require('electron');
const path = require('path');

// Create the main window for the application
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Disable nodeIntegration for security
      contextIsolation: true, // Enable context isolation
      preload: path.join(__dirname, 'preload.js'), // Load preload script
    },
  });

  // Load the HTML file
  win.loadFile('index.html');

  // Open DevTools for debugging (optional, remove in production)
  // win.webContents.openDevTools();
}

// When Electron is ready, create the window
app.whenReady().then(() => {
  createWindow();

  // Recreate window on macOS if all windows are closed and app is activated
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});