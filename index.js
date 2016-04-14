'use strict';

// index.js (main process)
// - GUI (renderer process)
// - GUI (renderer process)
// - GUI (renderer process)

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const storage = require('electron-json-storage');

let mainWindow;
let settingsWindow;

let menuTemplate = [{
  label: 'Sample',
  submenu: [
    { label: 'About', accelerator: 'CmdOrCtrl+Shift+A', click: function() { showAboutDialog(); } },
    { type: 'separator' },
    { label: 'Settings', accelerator: 'CmdOrCtrl+,', click: function() { showSettingsWindow(); }  },
    { type: 'separator' },
    { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function() { app.quit(); }  }
  ]
}, {
  label: 'Pages',
  submenu: [
    { label: 'Clinics', accelerator: 'CmdOrCtrl+C', click: function() { changePageURL('clinics'); } },
    { type: 'separator' },
    { label: 'Job Medley', accelerator: 'CmdOrCtrl+J', click: function() { changePageURL('jm'); } },
    { type: 'separator' },
    { label: 'Medley', accelerator: 'CmdOrCtrl+M', click: function() { changePageURL('medley'); }  },
    { type: 'separator' },
    { label: '介護のほんね', accelerator: 'CmdOrCtrl+H', click: function() { changePageURL('honne'); }  }
  ]
}];

let menu = Menu.buildFromTemplate(menuTemplate);

ipcMain.on('settings_changed', function(event, product) {
  var json = {
    'product': product
  };
  storage.set('config', json, function (error) {
    if (error) throw error;
  });
});

function createMainWindow() {
  Menu.setApplicationMenu(menu);
  mainWindow = new BrowserWindow({width: 1080, height: 600});

  storage.get('config', function (error, data) {
    if (error) throw error;
    mainWindow.loadURL(getUrlByProduct(data.product));
  });

  mainWindow.loadURL('https://clinics.medley.life/');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

function showAboutDialog() {
  dialog.showMessageBox({
    type: 'info',
    buttons: ['OK'],
    message: 'About This App',
    detail: 'This is App for enjoying Medley.inc, web applications.'
  });
}

app.on('ready', function() {
  createMainWindow();
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createMainWindow();
  }
});

function changePageURL(product) {
  mainWindow.loadURL(getUrlByProduct(product));
}

function getUrlByProduct(product) {
  switch (product) {
  case 'jm':
    return 'https://job-medley.com/';
  case 'medley':
    return 'https://medley.life/';
  case 'honne':
    return 'https://www.kaigonohonne.com/'
  default:
    return 'https://clinics.medley.life/';
  }
}

function showSettingsWindow() {
  settingsWindow = new BrowserWindow({width: 600, height: 400});
  settingsWindow.loadURL('file://' + __dirname + '/settings.html');
  settingsWindow.show();
  settingsWindow.on('closed', function() {
    settingsWindow = null;
  });
}
