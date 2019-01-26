const electron = require('electron');
const url = require('url');
const path = require('path');
const config = require(path.join(__dirname, '../../package.json'));
const menu = require(path.join(__dirname, './menu.js'));


const  { app, BrowserWindow, Menu} = electron;


let mainWindow;


//Listen for app ready
app.on('ready', function(){
    //Create new window
    mainWindow = new BrowserWindow({
      backgroundColor: 'lightgray',
      title: config.getName,
      show: true,
      simpleFullscreen:true,
      webPreferences: {
        nodeIntegration: true,
        defaultEncoding: 'UTF-8'
      }
    });
    mainWindow.maximize();
   
    //Load html file into window
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname,'../mainWindow.html'), 
        protocol: 'file', 
        slashes: true
    }));
    
    
});
function createMenuTempalte() {
   const template = [];
   // Edit Menu
   template.push({
      label: 'Edit',
      submenu: [
         { role: 'undo' },
         { role: 'redo' },
         { type: 'separator' },
         { role: 'cut' },
         { role: 'copy' },
         { role: 'paste' },
         { role: 'pasteandmatchstyle' },
         { role: 'delete' },
         { role: 'selectall' }
      ]
   });
   // View Menu
   template.push({
      label: 'Views',
      submenu: [
         { role: 'reload' },
         { role: 'forcereload' },
         { role: 'toggledevtools' },
         { type: 'separator' },
         { role: 'resetzoom' },
         { role: 'zoomin' },
         { role: 'zoomout' },
         { type: 'separator' },
         { role: 'togglefullscreen' }
      ]
   });
   // Windown menu
   template.push({
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
   });
   // Help menu
   template.push({
      role: 'help',
      submenu: [
         {
            label: 'Learn More',
            click() {
               require('electron').shell.openExternal('https://electron.atom.io');
            }
         }
      ]
   });

   if (process.platform === 'darwin') {
      template.unshift({
         label: app.getName(),
         submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services', submenu: [] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
         ]
      });

      // Edit menu
      template[1].submenu.push(
         { type: 'separator' },
         { label: 'Speech', submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }] }
      );

      // Window menu
      template[3].submenu = [{ role: 'close' }, { role: 'minimize' }, { role: 'zoom' }, { type: 'separator' }, { role: 'front' }];
   }
   menu = Menu.buildFromTemplate(template);
   Menu.setApplicationMenu(menu);
}