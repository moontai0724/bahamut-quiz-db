var sheetDB = SpreadsheetApp.openById('1bV8nZP0Iahgp1GoqTT7qNlgvQYPWmg2yT5Wcsta6lbo')

function getSheetData(quizSN, callback) {
    var sheet = sheetDB
        .getSheetByName(Math.floor(Number(quizSN) / 5000) * 5 + '000')
        .getDataRange()
        .getDisplayValues()

    if (callback) {
        return callback(sheet)
    } else {
        return sheet
    }
}

function binary_search(array, target) {
    var L = 0, R = array.length - 1
    while (L <= R) {
        var M = Math.floor((L + R) / 2)
        if (array[M][0] == target) return M
        else if (array[M][0] > target) R = M - 1
        else L = M + 1
    }
    return -1
}

function formatData(arr) {
    return {
        "sn": arr[0],
        "question": arr[1],
        "options": [arr[2], arr[3], arr[4], arr[5]],
        "answers": [arr[6], arr[7], arr[8], arr[9]],
        "answer": arr[10],
        "author": arr[11],
        "BoardSN": arr[12]
    }
}

function successResponse(message) {
    return {
        "success": true,
        "message": message
    }
}

function failResponse(message) {
    return {
        "success": false,
        "message": message
    }
}