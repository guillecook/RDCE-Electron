const settings = require('electron-settings');

ipc = require('electron').ipcRenderer;
ipc.on('message', (event, message) => console.log(message));


const buttonVerifyEndpoint = document.getElementById('buttonVerifyEndpoint');
buttonVerifyEndpoint.addEventListener('click', function (data) {
    var sEndpoint = $("#inputEndpoint").val();
    verifyEndpoint(sEndpoint);
    ipc.send('reply', `Send message from second window to renderer via main.`);
});

const buttonCloseApp = document.getElementById('buttonCloseApp');
buttonCloseApp.addEventListener('click', function (data) {
    closeApp();
});


//TODO: Pasemos todos los request a un js q los maneje 
function verifyEndpoint(sUrl) {
    const {
        net
    } = require('electron').remote;
    sUrl += "/doorsversion"
    const request = net.request(sUrl);
    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`)
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
        response.on('data', (chunk) => {
            alert("OK " + chunk);
            enableInputsUI();
        })
        response.on('end', () => {
            console.log('No more data in response.')
        })
    })
    request.end();
}

function enableInputsUI() {
    $("#inputEndpoint").attr("disabled", "disabled");
    $("#buttonVerifyEndpoint").attr("disabled", "disabled");

    $("#inputUsername").removeAttr("disabled");
    $("#inputPassword").removeAttr("disabled");
    $("#inputInstance").removeAttr("disabled");
    $("#buttonSignin").removeAttr("buttonSignin");
}

function closeApp() {
    ipc.sendSync('synchronous-message', "close-app");
}

function loadUserSettings() {

    if (settings.has('endpoint')) {

    }

    if (settings.has('username')) {

    }


    if (settings.has('password')) {

    }

    if (settings.has('authToken')) {

    }


    /*  Example  
    settings.set('name', {
          first: 'Cosmo',
          last: 'Kramer'
        });
       
        settings.get('name.first');
        // => "Cosmo"
       
        settings.has('name.middle');
        */
}