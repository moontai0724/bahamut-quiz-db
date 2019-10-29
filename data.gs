var filter = [
    {
        "requirements": { "type": /^checkExisting$/, "sn": /\d/ },
        "action": function (data) {
            var table = getSheetData(data.sn);
            var index = binary_search(table, Number(data.sn));

            return ContentService.createTextOutput(index != -1 && table[index][10] && table[index][12] ? 1 : " ");
        }
    },
    {
        "requirements": { "type": /^answer$/, "sn": /\d/ },
        "action": function (data) {
            var table = getSheetData(data.sn);
            var index = binary_search(table, Number(data.sn));

            return ContentService.createTextOutput(index != -1 ? table[index][10] : " ");
        }
    },
    {
        "requirements": { "type": /^hint$/, "sn": /\d/ },
        "action": function (data) {
            var table = getSheetData(data.sn);
            var index = binary_search(table, Number(data.sn));

            if (index != -1) {
                var wrongAnswers = [];
                [table[index][6], table[index][7], table[index][8], table[index][9]].forEach(function (value, index) {
                    if (value == 'N') wrongAnswers[wrongAnswers.length] = index;
                });

                return ContentService.createTextOutput(wrongAnswers.length != 0 ? wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)]++ : " ");
            } return ContentService.createTextOutput(' ');
        }
    },
    {
        "requirements": { "type": /^quizCount$/ },
        "action": function (data) {
            var response = { length: 0 }

            sheetDB.getSheets().forEach(function (sheet) {
                var rows = sheet.getMaxRows() - 1
                response[sheet.getName()] = rows
                response.length += rows
            })

            return ContentService.createTextOutput(JSON.stringify(response))
        }
    },
    {
        "requirements": { "type": /^fullSpreadsheet$/ },
        "action": function (data) {
            var response = {}

            sheetDB.getSheets().forEach(function (sheet) {
                var sheetValues = sheet.getDataRange().getDisplayValues()
                sheetValues.forEach(function (value) {
                    response[value[0]] = formatData(value)
                })
            })

            return ContentService.createTextOutput(JSON.stringify(response))
        }
    },
    {
        "requirements": { "type": /^sheet$/, "sn": /\d/ },
        "action": function (data) {
            var response = {}

            var sheetValues = getSheetData(data.sn);

            sheetValues.forEach(function (value) {
                response[value[0]] = formatData(value);
            });

            return ContentService.createTextOutput(JSON.stringify(response));
        }
    },
    {
        "requirements": { "type": /^randomQuiz$/, "bsn": /\d/ },
        "action": function (data) {
            var response = [];

            sheetDB.getSheets().forEach(function (sheet) {
                var sheetValues = sheet.getDataRange().getDisplayValues()
                response = response.concat(sheetValues.filter(function (value) {
                    return value[13] == data.bsn;
                }))
            })

            return ContentService.createTextOutput(JSON.stringify(formatData(response[Math.floor(Math.random() * response.length)])));
        }
    },
    {
        "requirements": { "type": /^randomQuiz$/ },
        "action": function (data) {
            var response = getSheetData(Math.random() * 99999);

            return ContentService.createTextOutput(JSON.stringify(formatData(response[Math.floor(Math.random() * response.length)])));
        }
    },
    {
        "requirements": {},
        "action": function (data) {
            return ContentService.createTextOutput('No Message');
        }
    }
];