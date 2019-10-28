// https://script.google.com/macros/s/AKfycbxYKwsjq6jB2Oo0xwz4bmkd3-5hdguopA6VJ5KD/exec?action=
function doGet(data) {
    data = data.parameter;
    // data = { action: undefined, sn: undefined }
    var database = {};
    if (data.action == 'getAnnouncement' || data.action == 'announcement') {
        return ContentService.createTextOutput('No Message');
    } else if (data.action == 'getQuizCount' || data.action == 'quizCount') {
        var response = { length: 0 };
        for (var i = 0; i < 20; i++) {
            response[i * 5 + "000"] = getSheetData(i * 5 + '000').length - 1;
            response.length += getSheetData(i * 5 + '000').length - 1;
        }
        return ContentService.createTextOutput(JSON.stringify(response));
    } else if (data.action == 'getFullSpreadsheet' || data.action == 'fullSpreadsheet') {
        for (var i = 0; i < 20; i++) {
            getSheetData(i * 5 + '000').forEach(function (arr) {
                database[arr[0]] = format(arr);
            });
        }

        return ContentService.createTextOutput(JSON.stringify(database));
    } else if ((data.action == 'getRandomQuiz' || data.action == 'randomQuiz') && data.bsn) {
        var response = [];
        for (var i = 0; i < 10; i++) response = response.concat(getSheetData(i + '0000'));
        response = response.filter(function (value) {
            return value[13] == data.bsn;
        });

        return ContentService.createTextOutput(JSON.stringify(format(response[Math.floor(Math.random() * response.length)])));
    } else if (data.action == 'getRandomQuiz' || data.action == 'randomQuiz') {
        var response = getSheetData(Math.floor(Math.random() * 8) + '0000');

        return ContentService.createTextOutput(JSON.stringify(format(response[Math.floor(Math.random() * response.length)])));
    } else if ((data.action == 'getSheet' || data.action == 'sheet') && data.sn) {
        getSheetData(Math.floor(Number(data.sn) / 5000) * 5 + '000').forEach(function (arr) {
            database[arr[0]] = format(arr);
        });

        return ContentService.createTextOutput(JSON.stringify(database));
    } else if ((data.action == 'getAns' || data.action == 'answer') && data.sn) {
        var table = getSheetData(Math.floor(Number(data.sn) / 5000) * 5 + '000');
        var index = binary_search(table, data.sn);

        return ContentService.createTextOutput(index != -1 ? table[index][10] : " ");
    } else if (data.action == 'check' && data.sn) {
        var table = getSheetData(Math.floor(Number(data.sn) / 5000) * 5 + '000');
        var index = binary_search(table, data.sn);

        return ContentService.createTextOutput(index != -1 && table[index][10] && table[index][11] ? 1 : " ");
    } else if ((data.action == 'getHint' || data.action == 'hint') && data.sn) {
        var table = getSheetData(Math.floor(Number(data.sn) / 5000) * 5 + '000');
        var index = binary_search(table, data.sn);

        if (index != -1) {
            var list = [];
            [table[index][6], table[index][7], table[index][8], table[index][9]].forEach(function (value, index) {
                if (value == 'N') list[list.length] = index;
            });

            return ContentService.createTextOutput(list.length != 0 ? list[Math.floor(Math.random() * list.length)] : " ");
        } return ContentService.createTextOutput(' ');
    } else return;
}