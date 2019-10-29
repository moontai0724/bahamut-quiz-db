// https://script.google.com/macros/s/AKfycbxYKwsjq6jB2Oo0xwz4bmkd3-5hdguopA6VJ5KD/exec?type=

function doGet(data) {
    data = data.parameter
    // data = { type: "answer", sn: 1 }
    // data = { type: undefined, sn: undefined }
    var result = mapping_result(data, 0)
    if (result != "No Message")
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON)
    else
        return ContentService.createTextOutput("No Message")
}

function mapping_result(data, index) {
    if (checkRequirements(data, filter[index].requirements)) {
        return filter[index].action(data)
    } else {
        return mapping_result(data, ++index)
    }
}

function checkRequirements(data, requirements) {
    var passed = []
    for (var key in requirements) {
        if (data[key])
            passed.push(requirements[key].test(data[key]))
        else passed.push(false)
    }
    return passed.indexOf(false) == -1
}