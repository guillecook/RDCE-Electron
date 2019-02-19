const settings = require('electron-settings');

ipc = require('electron').ipcRenderer;
ipc.on('message', (event, message) => console.log(message));


const buttonVerifyEndpoint = document.getElementById('buttonVerifyEndpoint');
buttonVerifyEndpoint.addEventListener('click', function (data) {
    var sEndpoint = $("#inputEndpoint").val();
    Doors.RESTFULL.ServerUrl = sEndpoint;
    settings.set('endpoint', {
        value: sEndpoint
    });
    verifyEndpoint();
});

const buttonEditEndpoint = document.getElementById('buttonEditEndpoint');
buttonEditEndpoint.addEventListener('click', function (data) {
    Doors.RESTFULL.ServerUrl = "";
    settings.set('endpoint', {
        value: ""
    });
    enableUserInputSection(false);
});

const buttonSignin = document.getElementById('buttonSignin');
buttonSignin.addEventListener('click', function (data) {
    doLogon();
});

const buttonSignout = document.getElementById('buttonSignout');
buttonSignout.addEventListener('click', function (data) {
    doLogoff();
});

const buttonExplore = document.getElementById('buttonExplore');
buttonExplore.addEventListener('click', function (data) {
    showExplorer();
});


initPage();


function initPage() {
    if (settings.has('endpoint')) {
        $("#inputEndpoint").val(settings.get("endpoint").value);
        verifyIsLogged();
    }
}

function verifyIsLogged() {
    if (settings.has('endpoint')) {
        Doors.RESTFULL.ServerUrl = settings.get("endpoint").value;
        if (settings.has('authToken')) {
            var token = settings.get("authToken").value;
            Doors.RESTFULL.AuthToken = token;
            DoorsAPI.islogged().then(
                function (bIslogged) {
                    if (bIslogged) {
                        $("#logonErrorMessage").addClass("d-none");
                        $("#buttonSignout").removeClass("d-none");
                        $("#buttonSignin").addClass("d-none");
                        $("#buttonExplore").removeClass("d-none");
                        setUserInputsUI();
                    }
                },
                function (err) {

                }
            );
        }
    }
}


function verifyEndpoint() {
    DoorsAPI.doorsVersion().then(
        function () {
            enableUserInputSection(true);
        },
        function (err) {
            enableUserInputSection(false);
        }
    );
}



function doLogoff() {
    DoorsAPI.logoff().then(
        function (token) {
            settings.set('authToken', {
                value: ""
            });
            settings.set('loggerUser', {
                value: ""
            });
            $("#buttonSignin").removeClass("d-none");
            $("#buttonSignout").addClass("d-none");
            $("#buttonExplore").addClass("d-none");
        },
        function (err) {
            showError(err.ExceptionMessage);
        }
    );
}

function doLogon() {
    var username = $('#inputUsername').val();
    var password = $('#inputPassword').val();
    var instance = $('#inputInstance').val();
    DoorsAPI.logon(username, password, instance).then(function (token) {
        Doors.RESTFULL.AuthToken = token;
        $("#logonErrorMessage").addClass("d-none");
        $("#buttonSignout").removeClass("d-none");
        $("#buttonExplore").removeClass("d-none");
        $("#buttonSignin").addClass("d-none");

        settings.set('authToken', {
            value: token
        });
        settings.set('username', {
            value: username
        });
        settings.set('password', {
            value: password
        });
        settings.set('instance', {
            value: instance
        });

        DoorsAPI.loggedUser().then(function (user) {
            settings.set('loggerUser', {
                value: user
            });
            //showExplorer();
        }, function (err) {
            console.log("Error on get loggedUser" + err.ExceptionMessage);
        });
    }, function (err) {
        showError(err.ExceptionMessage);
    });
}


function showError(message) {
    $("#logonErrorMessage").removeClass("invisible");
    $("#logonErrorMessage").html(message);
}

function setUserInputsUI() {
    $("#inputUsername").val("");
    if (settings.has("username")) {
        $("#inputUsername").val(settings.get("username").value);
    }
    $("#inputPassword").val("");
    if (settings.has("password")) {
        $("#inputPassword").val(settings.get("password").value);
    }
    $("#inputInstance").val("");
    if (settings.has("instance")) {
        $("#inputInstance").val(settings.get("instance").value);
    }
}



function closeApp() {
    ipc.sendSync('synchronous-message', "close-app");
}

function showExplorer() {
    ipc.sendSync('synchronous-message', "open-explorer");
}

function enableUserInputSection(value) {
    if (value) {
        $("#inputEndpoint").attr("disabled", "disabled");
        $("#buttonVerifyEndpoint").addClass("d-none");
        $("#buttonEditEndpoint").removeClass("d-none");
        
        $("#buttonVerifyEndpoint").attr("disabled", "disabled");
        $("#inputUsername").removeAttr("disabled");
        $("#inputPassword").removeAttr("disabled");
        $("#inputInstance").removeAttr("disabled");
        $("#buttonSignin").removeAttr("disabled");


    } else {
        $("#inputEndpoint").removeAttr("disabled");
        $("#buttonVerifyEndpoint").removeClass("d-none");
        $("#buttonEditEndpoint").addClass("d-none");

        $("#buttonVerifyEndpoint").removeAttr("disabled");
        $("#inputUsername").attr("disabled", "disabled");
        $("#inputPassword").attr("disabled", "disabled");
        $("#inputInstance").attr("disabled", "disabled");
        $("#buttonSignin").attr("disabled", "disabled");
    }
}