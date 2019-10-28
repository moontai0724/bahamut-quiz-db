function getSheetData(SheetName, callback) {
    var sheet = SpreadsheetApp
        .openById('1bV8nZP0Iahgp1GoqTT7qNlgvQYPWmg2yT5Wcsta6lbo')
        .getSheetByName(SheetName)
        .getDataRange()
        .getValues();

    if (callback) {
        return callback(sheet);
    } else {
        return sheet;
    }
}

function binary_search(array, target) {
    var L = 0, R = array.length - 1;
    while (L <= R) {
        var M = Math.floor((L + R) / 2);
        if (array[M][0] == target) return M;
        else if (array[M][0] > target) R = M - 1;
        else L = M + 1;
    }
    return -1;
}

function format(arr) {
    return {
        "quiz_sn": arr[0],
        "quiz_question": arr[1],
        "quiz_option_1": arr[2],
        "quiz_option_2": arr[3],
        "quiz_option_3": arr[4],
        "quiz_option_4": arr[5],
        "quiz_answer_1": arr[6],
        "quiz_answer_2": arr[7],
        "quiz_answer_3": arr[8],
        "quiz_answer_4": arr[9],
        "quiz_answer": arr[10],
        "reporter": arr[11],
        "author": arr[12],
        "BoardSN": arr[13]
    };
}