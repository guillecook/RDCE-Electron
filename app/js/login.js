ipc = require('electron').ipcRenderer;
ipc.on('message', (event, message) => console.log(message));
const settings = require('electron-settings');

const buttonVerifyEndpoint = document.getElementById('buttonVerifyEndpoint');

buttonVerifyEndpoint.addEventListener('click', function(data) {
    var sEndpoint = $("#inputEndpoint").val();
    verifyEndpoint(sEndpoint);
    ipc.send('reply', `Send message from second window to renderer via main.`);
    //
});


function verifyEndpoint(sUrl) {
    const {
        net
    } = require('electron').remote;
    sUrl+="/doorsversion"
    const request = net.request(sUrl);
    request.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`)
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
        response.on('data', (chunk) => {
            alert("OK " +chunk);
            console.log(`BODY: ${chunk}`);
            window.close();
        })
        response.on('end', () => {
            console.log('No more data in response.')
        })
    })
    request.end()
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