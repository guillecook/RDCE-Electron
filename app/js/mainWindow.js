const url = require('url');
const path = require('path');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const settings = require('electron-settings');
const { dialog } = require('electron')


initPage();

function initPage() {
   console.log("los breckpoints no se disparan sin esto!");
   debugger;
   //TODO: Validar esto si no existe o el token esta vencido cerrar y abrir el login 
   Doors.RESTFULL.ServerUrl = settings.get("endpoint").value;
   Doors.RESTFULL.AuthToken = settings.get("authToken").value;

   //loadFoldersTree();

}

var folderItemTemplate = `
<a href="#" class="list-group-item list-group-item-action bg-dark text-white">
   <span class="menu-collapsed" folder_id="[FOLDER_ID]" folder_name="[FOLDER_NAME]" >[FOLDER_DESCRIPTION]</span>
</a>
`;

function loadFoldersTree() {
   debugger;
   DoorsAPI.foldersTree().then(
      function (arrFolders) {
         _allFolders = arrFolders;
         debugger;
         var res = renderFoldersTree(1001);
         console.log(res);
         //$("#mCSB_1_container").html(res);
         return;
      },
      function (err) {
         debugger;
         console.log(err);
      }
   );
}


var parentWithChilds = "<a href='#[SUB_MENU_ID]' data-toggle='collapse aria-expanded='false' class='dropdown-toggle'>[FOLDER_DESCRIPTION]</a>";
var parent = "<a href='#'>[FOLDER_DESCRIPTION]</a>";
var content = "";
var _allFolders;
var _nexo = "<ul class='collapse list-unstyled components' id='[ITEM_RELATION]'><li>[CONTENT]</li></ul>";

function renderFoldersTree(parentFolderId) {
   var arrChilds = $.grep(_allFolders, function (f) {
      return f.ParentFolder === parentFolderId;
   });
   for (var index = 0; index < arrChilds.length; index++) {
      if (arrChilds[index].HaveFolders) {
         var temporalContent = parentWithChilds.replace("[FOLDER_DESCRIPTION]", arrChilds[index].Name).replace("[SUB_MENU_ID]", "CHILDS_" + arrChilds[index].FldId);
         content += _nexo.replace("[ITEM_RELATION]", "CHILDS_" + arrChilds[index].FldId).replace("[CONTENT]", temporalContent);
         content += renderFoldersTree(arrChilds[index].FldId);
      } else {
         content += parent.replace("[FOLDER_DESCRIPTION]", arrChilds[index].Name);
      }
   }
   return content;
}





/*const monacoeditorsample = document.getElementById('monacoeditorsample');
monacoeditorsample.addEventListener('click', function (data) {
   monacoEditorSampleWindow();
});*/

const monacoeditorsample = document.getElementById('test');
monacoeditorsample.addEventListener('click', function (data) {
   monacoEditorSampleWindow();
});

const folder_id_input_text = document.getElementById('folder-id-input-test');
folder_id_input_text.addEventListener('change', function (data) {
   var fld_id = document.getElementById('folder-id-input-test').value;
   if(fld_id!="")
   loadFolder(fld_id);
});

var currentFolder;
var currentAsyncEvents;
function loadFolder(folderId) {
   DoorsAPI.foldersGetFromId(folderId).then(
      function (folder) {
         currentFolder = folder;
         console.log(folder);
         loadFolderTab(folder);
         return;
      },
      function (err) {
         debugger;
         $("#informationDialog .modal-body").html("Probablemente no se encontro la carpeta. <br/> Message: " +err.Message + "</br> Method: " + err.Method);
         $("#informationDialog-button").click();
        
         console.log(response);
         console.log(err);
      }
   );
   DoorsAPI.folderAsyncEvents(folderId).then(
      function (asyncEvents) {
         currentAsyncEvents = asyncEvents;
         console.log(asyncEvents);
         loadSyncEvents(asyncEvents);
         return;
      },
      function (err) {
         debugger;
         console.log(err);
      }
   );
}

function loadFolderTab(folder){
   $("#folder-id").html(folder.FldId);
   $("#folder-name").html(folder.Name);
   $("#folder-description").html(folder.Description);
   $("#folder-description-raw").html(folder.DescriptionRaw);

   $("#folder-created").html(folder.Created);
   $("#folder-modified").html(folder.Modified);

   $("#folder-type").html(folder.Type);
   $("#folder-target").html(folder.Target);
}

function loadSyncEvents(asyncEvents){
   var asyncEventsTable = new Tabulator("#asyncEvents-table", { 
      height:"311px",
      layout:"fitColumns",
      columns:[
      {title:"EvnId", field:"EvnId"},
      {title:"Type", field:"Type"},
      {title:"Disabled", field:"Disabled"},
      {title:"IsCom", field:"IsCom"},
      {title:"Class", field:"Class"},
      {title:"Recursive", field:"Recursive"},
      {title:"Created", field:"Created"},
      {title:"Modified", field:"Modified"},
      {title:"HasCode", field:"HasCode"},
     
      ],
   });
   debugger;
   asyncEventsTable.setData(asyncEvents);
}



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

function loadContent(fldId) {

}