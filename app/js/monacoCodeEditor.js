const settings = require('electron-settings');
var electron = require('electron');


// renderer process
var ipcRenderMonaco = electron.ipcRenderer;
ipcRenderMonaco.on('document-params-data', function (event, args) {
    console.log('document-params-data: ');
    console.log(args);
    initPage(args);
});

function initPage(documentParams) {
    $("#loading-spinner").addClass("d-none");
    $("#container").removeClass("d-none");
    loadDocument(documentParams);
}

$(document).ready(function () {
    //TODO: Validar esto si no existe o el token esta vencido cerrar y abrir el login 
    Doors.RESTFULL.ServerUrl = settings.get("endpoint").value;
    Doors.RESTFULL.AuthToken = settings.get("authToken").value;
});

var currentDocument = null;
function loadDocument(documentParams) {
    DoorsAPI.documentsGetById(documentParams.docid).then(function (doc) {
        currentDocument = doc;
        var field = doc.CustomFields.find(field => field.Name == documentParams.column.toUpperCase());
        documentParams.code = field.Value;
        if(documentParams.code==null){
            documentParams.code = "";
        }
        loadEditor(documentParams);
    }, function (err) {
        console.log(err);
    });
}

function saveDocument(documentParams) {
    var field = currentDocument.CustomFields.find(field => field.Name == documentParams.column.toUpperCase());
    field.Value = documentParams.code;
    DoorsAPI.documentSave(currentDocument).then(function (doc) {
        console.log("documnet save ok");
    }, function (err) {
        console.log("documnet save fail");
        console.log(err);
    });
}
module.exports.saveDocument = saveDocument;