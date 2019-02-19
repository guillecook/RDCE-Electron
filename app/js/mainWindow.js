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
   loadLoggedUser();
   loadCurrentInstance();
   loadFoldersTree();

}


function loadFoldersTree() {
   DoorsAPI.foldersTree().then(
      function (arrFolders) {
         _allFolders = arrFolders;
         buildJsonTreeSource(1, jsonTreeResult[0]);
         buildJsonTreeSource(1001, jsonTreeResult[1]);
         $('#tree').treeview({
            data: jsonTreeResult,
            levels: 5,
            expandIcon: "fa fa-plus fa-xs",
            collapseIcon: "fa fa-minus fa-xs",
            onNodeSelected: function (event, data) {
               loadFolder(data.id);
            }
         });
         return;
      },
      function (err) {
         debugger;
         console.log(err);
      }
   );
}



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
         loadForm(folder.FrmId);
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
   const defaultFields = "doc_id, created, modified";
   const defaultFormula = "";
   const defaultOrder = "";
   const defaultMaxDocs = 500;
   const defaultRecursive = false;
   const defaultMaxDescriptionLength = 100;
   /*DoorsAPI.folderSearch(folderId, fields, formula, order, maxDocs, recursive, maxDescrLength).then(
      function (documents) {
         //fillFolderSyncEvents($("#syncEvents"), syncEvents);
      },
      function (err) {
         showErrorDialog(err);
      });
      */
}

function loadForm(formId) {
   if (formId) {
      DoorsAPI.formsGetById(formId).then(
         function (form) {
            console.log(form);
            //Aca llamar al seaarch del forlder despues de saber que campos tengo que buscar
         },
         function (err) {
            showErrorDialog(err);
         }
      );
   }
}

function showErrorDialog(err) {
   console.log(err);
   if (!$("#informationDialog").hasClass("show")) {
      $("#informationDialog .modal-body").html("Message: " + err.Message + "</br> Method: " + err.Method);
      $("#informationDialog-button").click();
   } else {
      $("#informationDialog .modal-body").html($("#informationDialog .modal-body").html() + "<hr/>Message: " + err.Message + "<br/> Method: " + err.Method);
   }
}

function loadLoggedUser() {
   DoorsAPI.loggedUser().then(

      function (user) {
         console.log(user);
         var url = Doors.RESTFULL.ServerUrl + "/accounts/" + user.AccId + "/picture";
         $("#logged-user-profile-icon").attr("src", url);
         $("#logged-user-name").html(user.FullName);
      },
      function (err) {
         console.log("Error logged user " + err);
      });
}

function loadCurrentInstance() {
   DoorsAPI.currentInstance().then(
      function (instance) {
         console.log(instance);
         $("#instance-description").html(instance.Description);
         $("#instance-name").html(instance.Name);
         //$("#instance-id").html(instance.InsId);
      },
      function (err) {
         console.log("Error current instance " + err);
      });
}

var jsonTreeResult = [{
      id: 1,
      text: "Carpetas de Sistema",
      color: "inherit",
      backColor: "transparent",
      selectable: true,
      state: {
         checked: false,
         disabled: false,
         expanded: false,
         selected: false
      },
      nodes: []
   },
   {
      id: 1001,
      text: "Carpetas Publicas",
      color: "inherit",
      backColor: "transparent",
      selectable: true,
      state: {
         checked: false,
         disabled: false,
         expanded: false,
         selected: false
      },
      nodes: []
   }
];
/* https://github.com/jonmiles/bootstrap-treeview*/
function buildJsonTreeSource(parentFolderId, parentNode) {
   var arrChilds = $.grep(_allFolders, function (f) {
      return f.ParentFolder === parentFolderId;
   });
   for (var index = 0; index < arrChilds.length; index++) {
      var jsonFolder = arrChilds[index];
      var haveNodes = null;

      if (jsonFolder.HaveFolders) {
         haveNodes = [];
      }
      var tempNode = {
         id: jsonFolder.FldId,
         text: jsonFolder.Name,
         icon: "fa " + jsonFolder.IconVector + " fa-xs",
         selectable: true,
         color: "inherit",
         backColor: "transparent",
         state: {
            checked: false,
            disabled: false,
            expanded: false,
            selected: false
         },
         nodes: haveNodes
      }
      parentNode.nodes.push(tempNode);
      if (jsonFolder.HaveFolders) {
         buildJsonTreeSource(jsonFolder.FldId, tempNode);
      }
   }
}




/**To Test */
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