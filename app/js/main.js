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
   debugger;
   loadLoginWindow(mainWindow);
});


let mainWindow;
let loginWindow;
let monacoEditorWindow;

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
   mainWindow.on('close', function () { //   <---- Catch close event
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
var nodeConsole = require('console');
var mainConsole = new nodeConsole.Console(process.stdout, process.stderr);


const {
   ipcMain
} = require('electron');
ipcMain.on('synchronous-message', (event, arg) => {
   if (arg.source == "table-cell-click") {
      console.log(arg.parameters);
      var parameters = JSON.parse(arg.parameters);
      loadMonacoEditorWindow(mainWindow, parameters);
      return;
   }
   if (arg == "close-app") {

   }
   if (arg == "open-explorer") {
      loadMainWindow();
      loginWindow.close();
   }

});

var openEditorParams = {
   fldid: null,
   docid: null,
   column: null
};


function loadMonacoEditorWindow(parentWindow, arg) {
   monacoEditorWindow = new BrowserWindow({
      parent: parentWindow,
      width: 450,
      height: 450,
      show: false
   });
   monacoEditorWindow.on('closed', (e) => {
      console.log(e);
      debugger;
      monacoEditorWindow = null
   });

   openEditorParams.fldid = arg.fldid;
   openEditorParams.docid = arg.docid;
   openEditorParams.column = arg.column;

   

   monacoEditorWindow.webContents.openDevTools();
   monacoEditorWindow.maximize()
   monacoEditorWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../monacoCodeEditor.html'),
      protocol: 'file',
      slashes: true
   }));

   monacoEditorWindow.webContents.on("did-finish-load", function () {
      monacoEditorWindow.webContents.send('document-params-data', {
         fldid: openEditorParams.fldid,
         docid: openEditorParams.docid,
         column: openEditorParams.column
      });
   });
   monacoEditorWindow.once("ready-to-show", () => {
      monacoEditorWindow.show();
   });
}





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