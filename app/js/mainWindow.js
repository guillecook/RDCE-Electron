const url = require('url');
const path = require('path');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const settings = require('electron-settings');

initPage();

function initPage() {
   //TODO: Validar esto si no existe o el token esta vencido cerrar y abrir el login 
   Doors.RESTFULL.ServerUrl = settings.get("endpoint").value;
   Doors.RESTFULL.AuthToken = settings.get("authToken").value;

   loadFoldersTree();

}

var folderItemTemplate = `
<a href="#" class="list-group-item list-group-item-action bg-dark text-white">
   <span class="menu-collapsed" folder_id="[FOLDER_ID]" folder_name="[FOLDER_NAME]" >[FOLDER_DESCRIPTION]</span>
</a>
`;

function loadFoldersTree() {
   DoorsAPI.foldersTree().then(
      function (arrFolders) {
         var arrSystemFolders = arrFolders.filter(function (node, index) {
            return (node.RootFolderId == 1);
         });
         var content = "";
         arrSystemFolders.forEach(element => {
            var sFolderDescription = element.Description;
            if (sFolderDescription == "") {
               sFolderDescription = element.Name;
            }
            content += folderItemTemplate.replace("[FOLDER_ID]", element.FldId).replace("[FOLDER_NAME]", element.Name).replace("[FOLDER_DESCRIPTION]", sFolderDescription);
         });
         $("#submenuSystemFolders").html(content);
      },
      function (err) {
         debugger;
         console.log(err);
      }
   );
}






/*const monacoeditorsample = document.getElementById('monacoeditorsample');
monacoeditorsample.addEventListener('click', function (data) {
   monacoEditorSampleWindow();
});*/



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