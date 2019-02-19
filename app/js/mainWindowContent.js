/**Folder Tab Content */
const folderInformationTabContent = `
<label class="label-title">Id:</label> <label id="folder-id"></label><br />
<label class="label-title">Nombre: </label> <label id="folder-name"></label><br />
<label class="label-title">Description: </label> <label id="folder-description"></label><br />
<label class="label-title">Description Raw: </label> <label id="folder-description-raw"></label><br />
<hr />
<label class="label-title">Created: </label> <label id="folder-created"></label><br />
<label class="label-title">Modified: </label> <label id="folder-modified"></label><br />
<hr />
<label class="label-title">Type: </label> <label id="folder-type"></label><br />
<label class="label-title">Form Id: </label> <label id="folder-form"></label><br />

<label class="label-title">Target: </label> <label id="folder-target"></label><br />`
function loadActiveTab(){
    $("#folder-tab").click();
}

function hideAllTabs(){
    $("#documents-tab").addClass("d-none");
    $("#syncEvents-tab").addClass("d-none");
    $("#asyncEvents-tab").addClass("d-none");
    $("#views-tab").addClass("d-none");
    $("#folder-tab").addClass("d-none");
}

function fillFolderInfromation(container, folder) {
    loadActiveTab();
    $("#folder-tab").removeClass("d-none");
    console.log(folder);
    container.html(folderInformationTabContent);
    $("#folder-id").html(folder.FldId);
    $("#folder-name").html(folder.Name);
    $("#folder-description").html(folder.Description);
    $("#folder-description-raw").html(folder.DescriptionRaw);
    $("#folder-created").html(folder.Created);
    $("#folder-modified").html(folder.Modified);
    $("#folder-type").html(folder.Type);
    $("#folder-form").html(folder.FrmId);
    $("#folder-target").html(folder.Target);
}

/**Folder AsyncEvents Tab Content */
const folderAsyncEventsTabContent = `  
Listado de eventos asincronos
<div id="asyncEvents-table"></div>`

function fillFolderAsyncEvents(container, asyncEvents) {
    $("#asyncEvents-tab").removeClass("d-none");    
    console.log(asyncEvents);
    container.html(folderAsyncEventsTabContent);
    var asyncEventsTable = new Tabulator("#asyncEvents-table", {
        height: "311px",
        layout: "fitColumns",
        columns: [{
                title: "EvnId",
                field: "EvnId",
                sorter: "number"
            },
            {
                title: "Type",
                field: "Type"
            },
            {
                title: "Disabled",
                field: "Disabled"
            },
            {
                title: "IsCom",
                field: "IsCom"
            },
            {
                title: "Class",
                field: "Class"
            },
            {
                title: "Recursive",
                field: "Recursive"
            },
            {
                title: "Created",
                field: "Created"
            },
            {
                title: "Modified",
                field: "Modified"
            },
            {
                title: "HasCode",
                field: "HasCode"
            },
        ],
        initialSort: [{
            column: "EvnId",
            dir: "asc"
        }, 
    ]
    });
    asyncEventsTable.setData(asyncEvents);
}

/**Folder SyncEvents Tab Content */
const folderSyncEventsTabContent = `  
Listado de eventos sincronos
<div id="syncEvents-table"></div>`

function fillFolderSyncEvents(container, syncEvents) {
    $("#syncEvents-tab").removeClass("d-none");    
    console.log(syncEvents);
    container.html(folderSyncEventsTabContent);
    var syncEventsTable = new Tabulator("#syncEvents-table", {
        height: "811px",
        layout: "fitColumns",
        columns: [{
                title: "SevId",
                field: "SevId",
                sorter: "number"
            },
            {
                title: "Name",
                field: "Name"
            },
            {
                title: "Created",
                field: "Created"
            },
            {
                title: "Modified",
                field: "Modified"
            },
            {
                title: "Overrides",
                field: "Overrides"
            },
            {
                title: "Code",
                field: "Code"
            }
        ],
        initialSort: [{
                column: "SevId",
                dir: "asc"
            }, 
        ]
    });
    syncEventsTable.setData(syncEvents);
}