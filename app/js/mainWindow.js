const url = require('url');
const path = require('path');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const settings = require('electron-settings');
const {
   dialog
} = require('electron')
ipc = require('electron').ipcRenderer;


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

function loadFolder(folderId) {
   hideAllTabs();
   DoorsAPI.foldersGetFromId(folderId).then(
      function (folder) {
         fillFolderInfromation($("#folder"), folder);
         loadForm(folder.FrmId, folderId);
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

function loadForm(formId, folderId) {
   if (formId) {
      DoorsAPI.formsGetById(formId).then(
         function (form) {
            var fields = getKnowFields(form.Guid);
            //Aca llamar al search del forlder despues de saber que campos tengo que buscar
            if (fields == "") {
               fields = getDefaultFields();
            }
            documentSearch(folderId, fields);
         },
         function (err) {
            showErrorDialog(err);
         }
      );
   }
}

function documentSearch(folderId, jsonFields) {
   const defaultFields = "doc_id, created, modified";

   const defaultFormula = "";
   const defaultOrder = "";
   const defaultMaxDocs = 500;
   const defaultRecursive = false;
   const defaultMaxDescriptionLength = 100;
   var sFields = "";
   var sCodeColumnName = ""
   for (var index = 0; index < jsonFields.length; index++) {
      if (sFields != "") {
         sFields += ",";
      }
      sFields += jsonFields[index].name;
      if (jsonFields[index].isCodeColumn) {
         sCodeColumnName = jsonFields[index].name;
      }
   }
   if (sFields == "") {
      sFields = defaultFields;
   }
   DoorsAPI.folderSearch(folderId, sFields, defaultFormula, defaultOrder, defaultMaxDocs, defaultRecursive, defaultMaxDescriptionLength).then(
      function (documents) {
         fillDocuments($("#documentts"), documents, jsonFields, sCodeColumnName);
      },
      function (err) {
         showErrorDialog(err);
      });
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