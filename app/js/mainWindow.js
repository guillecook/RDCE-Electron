const url = require('url');
const path = require('path');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const settings = require('electron-settings');
const {
   dialog
} = require('electron')


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
   if (fld_id != "")
      loadFolder(fld_id);
});

function loadFolder(folderId) {
   DoorsAPI.foldersGetFromId(folderId).then(
      function (folder) {
         fillFolderInfromation($("#folder"), folder);
      },
      function (err) {
         showErrorDialog(err);
      }
   );
   DoorsAPI.folderAsyncEvents(folderId).then(
      function (asyncEvents) {
         fillFolderAsyncEvents($("#asyncEvents"), asyncEvents);
      },
      function (err) {
         showErrorDialog(err);
      }
   );

   DoorsAPI.folderEvents(folderId).then(
      function (syncEvents) {
         fillFolderSyncEvents($("#syncEvents"), syncEvents);
      },
      function (err) {
         showErrorDialog(err);
      }
   );

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

function showErrorDialog(err) {
   console.log(err);
   if(!$("#informationDialog").hasClass("show")){
      $("#informationDialog .modal-body").html("Message: " + err.Message + "</br> Method: " + err.Method);
      $("#informationDialog-button").click();
   }else{
      $("#informationDialog .modal-body").html($("#informationDialog .modal-body").html()+ "<hr/>Message: " + err.Message + "<br/> Method: " + err.Method);
   }
}