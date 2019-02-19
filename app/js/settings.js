var knowFormFields = {
    forms: [{
        guid: "EAC99A4211204E1D8EEFEB8273174AC4",
        name: "controls", //doc_id,name,control,scriptbeforerender,created,modified
        fields: [{
                name: "doc_id"
            },
            {
                name: "name"
            },
            {
                name: "control"
            },
            {
                name: "scriptbeforerender"
            },
            {
                name: "created"
            },
            {
                name: "modified"
            }
        ],
        guid: "F89ECD42FAFF48FDA229E4D5C5F433ED",
        name: "codelib", //doc_id,name,code,created,modified
        fields: [{
                name: "doc_id"
            },
            {
                name: "name"
            },
            {
                name: "code"
            },
            {
                name: "created"
            },
            {
                name: "modified"
            }
        ]
    }]
};


/** 
 * getFieldsFromForm
 * * Funcion que devuelve los fields de los forms conocidos 
 * * Comentarios utilizando - https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments
 * ? Deberia leerse tambien las propiedades del formulario para saber si existe alguno custom o no conocido
 * @param formGuid guid id del formulario
 */
function getKnowFields(formGuid) {
    debugger;
    formGuid = formGuid.replaceAll("-","");
    var fields = "";
    $.each(knowFormFields, function (i, v) {
        if (v[0].guid.toString().toUpperCase() == formGuid.toString().toUpperCase()) {
            fields = v[0].fields;
            return;
        }
    });
    return fields;
}