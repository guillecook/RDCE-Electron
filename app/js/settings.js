var knowFormFields = {
    forms: [{
            guid: "EAC99A4211204E1D8EEFEB8273174AC4",
            name: "controls", //doc_id,name,control,scriptbeforerender,created,modified
            fields: [{
                    name: "doc_id"
                },
                {
                    name: "fld_id"
                },
                {
                    name: "name"
                },
                {
                    name: "control"
                },
                {
                    name: "scriptbeforerender",
                    isCodeColumn: true
                },
                {
                    name: "created"
                },
                {
                    name: "modified"
                }
            ]
        },
        {
            guid: "F89ECD42FAFF48FDA229E4D5C5F433ED",
            name: "codelib", //doc_id,name,code,created,modified
            fields: [{
                    name: "doc_id"
                },
                {
                    name: "fld_id"
                },
                {
                    name: "name"
                },
                {
                    name: "code",
                    isCodeColumn: true
                },
                {
                    name: "created"
                },
                {
                    name: "modified"
                }
            ]
        }
    ]
};

var defaultDocumentsFields = {
    fields: [{
            name: "doc_id"
        },
        {
            name: "fld_id"
        },
        {
            name: "subject"
        },
        {
            name: "created"
        },
        {
            name: "modified"
        }
    ]
};



/** 
 * getFieldsFromForm
 * * Funcion que devuelve los fields de los forms conocidos 
 * * Comentarios utilizando - https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments
 * ? Deberia leerse tambien las propiedades del formulario para saber si existe alguno custom o no conocido
 * @param formGuid guid id del formulario
 */
function getKnowFields(formGuid) {
    formGuid = formGuid.replaceAll("-", "");
    var fields = "";
    for (var index = 0; index < knowFormFields.forms.length; index++) {
        if (knowFormFields.forms[index].guid.toString().toUpperCase() == formGuid.toString().toUpperCase()) {
            fields = knowFormFields.forms[index].fields;
            break;
        }
    }
    return fields;
}

function getDefaultFields() {
    return defaultDocumentsFields.fields;
}