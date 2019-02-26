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
    loadEditor(documentParams);
    $("#loading-spinner").addClass("d-none");
    $("#container").removeClass("d-none");
}

$(document).ready(function () {
    //TODO: Validar esto si no existe o el token esta vencido cerrar y abrir el login 
    Doors.RESTFULL.ServerUrl = settings.get("endpoint").value;
    Doors.RESTFULL.AuthToken = settings.get("authToken").value;
});