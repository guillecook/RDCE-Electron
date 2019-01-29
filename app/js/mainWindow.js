
const url = require('url');
const path = require('path');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;

const monacoeditorsample = document.getElementById('monacoeditorsample');
monacoeditorsample.addEventListener('click', function (data) {
    monacoEditorSampleWindow();
});


function monacoEditorSampleWindow(parentWindow) {
    let monacoEditorSampleWindow;
    monacoEditorSampleWindow = new BrowserWindow({
       parent: parentWindow,
       width: 500,
       height: 450,
       frame: true,
       modal: true
    });
    monacoEditorSampleWindow.on('closed', (e) => {
       console.log(e);
       debugger;
       //monacoEditorSampleWindow = null
    });
    monacoEditorSampleWindow.loadURL(url.format({
       pathname: path.join(__dirname, '../monacoeditorsample.html'),
       protocol: 'file',
       slashes: true
    }));
 }