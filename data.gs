var filter = [
    {
        "requirements": { "type": /^announcement$/ },
        "action": function (data) {
            return ContentService.createTextOutput('No Message');
        }
    },
    {
        "requirements": { "type": /^check$/ },
        "action": function (data) {
            var table = getSheetData(Math.floor(Number(data.sn) / 5000) * 5 + '000');
            var index = binary_search(table, data.sn);

            return ContentService.createTextOutput(index != -1 && table[index][10] && table[index][11] ? 1 : " ");
        }
    },
    {
        "requirements": { "type": /^answer$/, "sn": /\d/ },
        "action": function (data) {
            var table = getSheetData(Math.floor(Number(data.sn) / 5000) * 5 + '000');
            var index = binary_search(table, data.sn);

            return ContentService.createTextOutput(index != -1 ? table[index][10] : " ");
        }
    },
    {
        "requirements": { "type": /^hint$/, "sn": /\d/ },
        "action": function (data) {
            var table = getSheetData(Math.floor(Number(data.sn) / 5000) * 5 + '000');
            var index = binary_search(table, data.sn);

            if (index != -1) {
                var list = [];
                [table[index][6], table[index][7], table[index][8], table[index][9]].forEach(function (value, index) {
                    if (value == 'N') list[list.length] = index;
                });

                return ContentService.createTextOutput(list.length != 0 ? list[Math.floor(Math.random() * list.length)] : " ");
            } return ContentService.createTextOutput(' ');
        }
    },
    {
        "requirements": { "type": /^quizCount$/ },
        "action": function (data) {
            var response = { length: 0 };
            for (var i = 0; i < 20; i++) {
                response[i * 5 + "000"] = getSheetData(i * 5 + '000').length - 1;
                response.length += getSheetData(i * 5 + '000').length - 1;
            }
            return ContentService.createTextOutput(JSON.stringify(response));
        }
    },
    {
        "requirements": { "type": /^fullSpreadsheet$/ },
        "action": function (data) {
            for (var i = 0; i < 20; i++) {
                getSheetData(i * 5 + '000').forEach(function (arr) {
                    database[arr[0]] = format(arr);
                });
            }

            return ContentService.createTextOutput(JSON.stringify(database));
        }
    },
    {
        "requirements": { "type": /^randomQuiz$/, "bsn": /\d/ },
        "action": function (data) {
            var response = [];
            for (var i = 0; i < 10; i++) response = response.concat(getSheetData(i + '0000'));
            response = response.filter(function (value) {
                return value[13] == data.bsn;
            });

            return ContentService.createTextOutput(JSON.stringify(format(response[Math.floor(Math.random() * response.length)])));
        }
    },
    {
        "requirements": { "type": /^randomQuiz$/ },
        "action": function (data) {
            var response = getSheetData(Math.floor(Math.random() * 8) + '0000');

            return ContentService.createTextOutput(JSON.stringify(format(response[Math.floor(Math.random() * response.length)])));
        }
    },
    {
        "requirements": { "type": /^sheet$/, "sn": /\d/ },
        "action": function (data) {
            getSheetData(Math.floor(Number(data.sn) / 5000) * 5 + '000').forEach(function (arr) {
                database[arr[0]] = format(arr);
            });

            return ContentService.createTextOutput(JSON.stringify(database));
        }
    },
    {
        "requirements": {},
        "action": function (data) {
            return;
        }
    }
];