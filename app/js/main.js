const electron = require('electron');
const url = require('url');
const path = require('path');
const config = require(path.join(__dirname, '../../package.json'));
const menu = require(path.join(__dirname, './menu.js'));
const settings = require('electron-settings');


const {
   app,
   BrowserWindow,
   Menu
} = electron;

//Listen for app ready
app.on('ready', function () {
   //loadMainWindow();
   loadLoginWindow(mainWindow);
});


let mainWindow;

function loadMainWindow() {
   //Create new main window
   mainWindow = new BrowserWindow({
      backgroundColor: 'lightgray',
      title: config.getName,
      show: true,
      simpleFullscreen: true,
      webPreferences: {
         nodeIntegration: true,
         defaultEncoding: 'UTF-8'
      }
   });
   mainWindow.maximize();
   mainWindow.on('close', function() { //   <---- Catch close event
      mainWindow = null;
      loadLoginWindow();
   });
   //Load html file into main window
   mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../mainWindow.html'),
      protocol: 'file',
      slashes: true
   }));
   mainWindow.webContents.openDevTools();
}

//Login window
//TODO: cuando lo llamamos?
let loginWindow;

function loadLoginWindow(parentWindow) {
   loginWindow = new BrowserWindow({
      parent: parentWindow,
      width: 500,
      height: 550,
      frame: true,
      modal: true,
      webPreferences: {
         nodeIntegration: true,
         defaultEncoding: 'UTF-8'
      }
   });
   loginWindow.on('closed', (e) => {
      console.log(e);
      debugger;
      
   });
   loginWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../login.html'),
      protocol: 'file',
      slashes: true
   }));
}

const {
   ipcMain
} = require('electron');
ipcMain.on('synchronous-message', (event, arg) => {
   if (arg == "close-app") {
   }
   if (arg == "open-explorer") {
      loadMainWindow();
      loginWindow.close();
   }
});





//TODO: Este menu deberia venir de algun json aparte? menu js? como?
function createMenuTempalte() {
   const template = [];
   // Edit Menu
   template.push({
      label: 'Edit',
      submenu: [{
            role: 'undo'
         },
         {
            role: 'redo'
         },
         {
            type: 'separator'
         },
         {
            role: 'cut'
         },
         {
            role: 'copy'
         },
         {
            role: 'paste'
         },
         {
            role: 'pasteandmatchstyle'
         },
         {
            role: 'delete'
         },
         {
            role: 'selectall'
         }
      ]
   });
   // View Menu
   template.push({
      label: 'Views',
      submenu: [{
            role: 'reload'
         },
         {
            role: 'forcereload'
         },
         {
            role: 'toggledevtools'
         },
         {
            type: 'separator'
         },
         {
            role: 'resetzoom'
         },
         {
            role: 'zoomin'
         },
         {
            role: 'zoomout'
         },
         {
            type: 'separator'
         },
         {
            role: 'togglefullscreen'
         }
      ]
   });
   // Windown menu
   template.push({
      role: 'window',
      submenu: [{
         role: 'minimize'
      }, {
         role: 'close'
      }]
   });
   // Help menu
   template.push({
      role: 'help',
      submenu: [{
         label: 'Learn More',
         click() {
            require('electron').shell.openExternal('https://electron.atom.io');
         }
      }]
   });

   if (process.platform === 'darwin') {
      template.unshift({
         label: app.getName(),
         submenu: [{
               role: 'about'
            },
            {
               type: 'separator'
            },
            {
               role: 'services',
               submenu: []
            },
            {
               type: 'separator'
            },
            {
               role: 'hide'
            },
            {
               role: 'hideothers'
            },
            {
               role: 'unhide'
            },
            {
               type: 'separator'
            },
            {
               role: 'quit'
            }
         ]
      });

      // Edit menu
      template[1].submenu.push({
         type: 'separator'
      }, {
         label: 'Speech',
         submenu: [{
            role: 'startspeaking'
         }, {
            role: 'stopspeaking'
         }]
      });

      // Window menu
      template[3].submenu = [{
         role: 'close'
      }, {
         role: 'minimize'
      }, {
         role: 'zoom'
      }, {
         type: 'separator'
      }, {
         role: 'front'
      }];
   }
   //Apply menu template
   menu = Menu.buildFromTemplate(template);
   Menu.setApplicationMenu(menu);
}