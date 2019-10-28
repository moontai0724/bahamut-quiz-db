function doPost(data) {
    data = JSON.parse(data.postData.contents);
    if (data.version && data.quiz_sn && data.quiz_question && data.quiz_option_1 && data.quiz_option_2 && data.quiz_option_3 && data.quiz_option_4 && data.reporter && data.BoardSN && data.this_answered && (data.correctness == true || data.correctness == false)) {
        return getSheetData(Math.floor(Number(data.quiz_sn) / 5000) * 5 + '000', function (sheet) {
            var response = { status: 200, data: data, message: 'Success' };
            var index = binary_search(sheet, data.quiz_sn);

            if (index != -1) {
                if (data.correctness && sheet[index][10] == ' ' && data.author) {
                    SpreadsheetApp
                        .openById('1bV8nZP0Iahgp1GoqTT7qNlgvQYPWmg2yT5Wcsta6lbo')
                        .getSheetByName(Math.floor(Number(data.quiz_sn) / 5000) * 5 + '000')
                        .getRange('A' + (index + 1) + ':M' + (index + 1))
                        .setValues([[data.quiz_sn, data.quiz_question, data.quiz_option_1, data.quiz_option_2, data.quiz_option_3, data.quiz_option_4,
                        data.this_answered == 1 ? 'Y' : 'N', data.this_answered == 2 ? 'Y' : 'N',
                        data.this_answered == 3 ? 'Y' : 'N', data.this_answered == 4 ? 'Y' : 'N',
                        data.this_answered, (database[data.quiz_sn].reporter.indexOf(data.reporter) == -1 && data.reporter != ' ') ? database[data.quiz_sn].reporter + ', ' + data.reporter : database[data.quiz_sn].reporter, data.author, data.BoardSN]]);
                    response.message = 'Update data success.';
                } else if (!data.correctness && sheet[index][5 + Number(data.this_answered)] == ' ') {
                    var targetColumn = ['G', 'H', 'I', 'J'][Number(data.this_answered) - 1];
                    SpreadsheetApp
                        .openById('1bV8nZP0Iahgp1GoqTT7qNlgvQYPWmg2yT5Wcsta6lbo')
                        .getSheetByName(Math.floor(Number(data.quiz_sn) / 5000) * 5 + '000')
                        .getRange(targetColumn + (index + 1) + ':' + targetColumn + (index + 1))
                        .setValue('N');
                    response.message = 'Update data success.';
                } else response.message = 'Data already exists.';
            } else {
                SpreadsheetApp
                    .openById('1bV8nZP0Iahgp1GoqTT7qNlgvQYPWmg2yT5Wcsta6lbo')
                    .getSheetByName(Math.floor(Number(data.quiz_sn) / 5000) * 5 + '000')
                    .appendRow([data.quiz_sn, data.quiz_question, data.quiz_option_1, data.quiz_option_2, data.quiz_option_3, data.quiz_option_4,
                    data.this_answered == 1 ? (data.correctness ? 'Y' : 'N') : (data.correctness ? 'N' : ''),
                    data.this_answered == 2 ? (data.correctness ? 'Y' : 'N') : (data.correctness ? 'N' : ''),
                    data.this_answered == 3 ? (data.correctness ? 'Y' : 'N') : (data.correctness ? 'N' : ''),
                    data.this_answered == 4 ? (data.correctness ? 'Y' : 'N') : (data.correctness ? 'N' : ''),
                    data.this_answered, data.reporter, data.author, data.BoardSN]);
                response.message = "Add new data success.";
            }

            SpreadsheetApp.openById('1bV8nZP0Iahgp1GoqTT7qNlgvQYPWmg2yT5Wcsta6lbo').getSheetByName(Math.floor(Number(data.quiz_sn) / 5000) * 5 + '000').sort(1);
            return ContentService.createTextOutput(JSON.stringify(response));
        });
    } else {
        return ContentService.createTextOutput(' ');
    }
}