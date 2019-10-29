function doPost(data) {
    data = JSON.parse(data.postData.contents);
    if (checkData(data)) {
        return getSheetData(data.sn, function (sheet) {
            var sheetName = Math.floor(Number(data.quiz_sn) / 5000) * 5 + '000';

            var response = { status: 200, data: data, message: 'Success' };
            var index = binary_search(sheet, Number(data.quiz_sn));

            if (index != -1) {
                if (data.correctness && sheet[index][10] == ' ') {
                    sheetDB
                        .getSheetByName(sheetName)
                        .getRange('A' + (index + 1) + ':M' + (index + 1))
                        .setValues([[data.sn, data.question, data.options[0], data.options[1], data.options[2], data.options[3],
                        data.this_answered == 1 ? 'Y' : 'N', data.this_answered == 2 ? 'Y' : 'N',
                        data.this_answered == 3 ? 'Y' : 'N', data.this_answered == 4 ? 'Y' : 'N',
                        data.this_answered, (database[data.sn].reporter.indexOf(data.reporter) == -1 && data.reporter != ' ') ? database[data.sn].reporter + ', ' + data.reporter : database[data.sn].reporter, data.author, data.BoardSN]]);
                    response.message = 'Update data success.';
                } else if (!data.correctness && sheet[index][5 + Number(data.this_answered)] == ' ') {
                    var targetColumn = ['G', 'H', 'I', 'J'][Number(data.this_answered) - 1];
                    sheetDB
                        .getSheetByName(sheetName)
                        .getRange(targetColumn + (index + 1) + ':' + targetColumn + (index + 1))
                        .setValue('N');
                    response.message = 'Update data success.';
                } else response.message = 'Data already exists.';

                if (!sheet[index][12]) {
                    sheetDB
                        .getSheetByName(sheetName)
                        .getRange("M" + (index + 1) + ':' + "M" + (index + 1))
                        .setValue(data.author);
                    response.message = 'Update data success.';
                }
            } else {
                sheetDB
                    .getSheetByName(sheetName)
                    .appendRow([data.sn, data.question, data.options[0], data.options[1], data.options[2], data.options[3],
                    data.this_answered == 1 ? (data.correctness ? 'Y' : 'N') : (data.correctness ? 'N' : ''),
                    data.this_answered == 2 ? (data.correctness ? 'Y' : 'N') : (data.correctness ? 'N' : ''),
                    data.this_answered == 3 ? (data.correctness ? 'Y' : 'N') : (data.correctness ? 'N' : ''),
                    data.this_answered == 4 ? (data.correctness ? 'Y' : 'N') : (data.correctness ? 'N' : ''),
                    data.this_answered, "anonymous", data.author, data.BoardSN]);
                response.message = "Add new data success.";
            }

            sheetDB.getSheetByName(sheetName).sort(1);
            return ContentService.createTextOutput(JSON.stringify(response));
        });
    } else {
        return ContentService.createTextOutput(' ');
    }
}

function checkData(data) {
    if (data.version &&
        data.sn &&
        data.question
        && data.options && data.options.length == 4 &&
        data.BoardSN &&
        data.this_answered &&
        (data.correctness == true || data.correctness == false)) {
        return true
    } else {
        return false
    }
}