
const settings = require('electron-settings');
var electron = require('electron');

var sender;
var params;
// renderer process
/**
 * TODO: No puedo hacer andar el meensaje entre el main process y el browser window
 * Va como setting como WA */
var ipcRenderMonaco = electron.ipcRenderer;
ipcRenderMonaco.on('document-params-data', function (event, args) {
    params = args;
    sender = event
   initPage(args);
   debugger;
   console.log("event recieve: "+ JSON.stringify(params.source));
});

/**
 * WA
 */
var documentParams = settings.get("documentOpenParams").value;
//console.log(documentParams.docid);
//initPage(documentParams);

function initPage(documentParams) {
   
 
    loadEditor(documentParams);
    $("#loading-spinner").addClass("d-none");
    $("#container").removeClass("d-none");

}

$( document ).ready(function() {
     //TODO: Validar esto si no existe o el token esta vencido cerrar y abrir el login 
     Doors.RESTFULL.ServerUrl = settings.get("endpoint").value;
     Doors.RESTFULL.AuthToken = settings.get("authToken").value;
});
