var filter = [
    {
        "requirements": { "type": /^checkExisting$/, "sn": /\d/ },
        "action": function (data) {
            var table = getSheetData(data.sn)
            var index = binary_search(table, Number(data.sn))

            if (index > -1 && table[index][6] != "" && table[index][7] != "")
                return successResponse(1)
            else
                return failResponse(0)
        }
    },
    {
        "requirements": { "type": /^answer$/, "sn": /\d/ },
        "action": function (data) {
            var table = getSheetData(data.sn)
            var index = binary_search(table, Number(data.sn))

            if (index > -1)
                return successResponse(table[index][6])
            else
                return failResponse()
        }
    },
    {
        "requirements": { "type": /^hint$/, "sn": /\d/ },
        "action": function (data) {
            var table = getSheetData(data.sn)
            var index = binary_search(table, Number(data.sn))

            if (index > -1) {
                var wrongAnswers = [1, 2, 3, 4].filter(function (value) {
                    return value == table[index][6]
                });

                if (wrongAnswers.length > 0)
                    return successResponse(++wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)])
            }

            return failResponse()
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

            return successResponse(response)
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

            return successResponse(response)
        }
    },
    {
        "requirements": { "type": /^sheet$/, "sn": /\d/ },
        "action": function (data) {
            var response = {}

            var sheetValues = getSheetData(data.sn)

            sheetValues.forEach(function (value) {
                response[value[0]] = formatData(value)
            })

            return successResponse(response)
        }
    },
    {
        "requirements": { "type": /^quiz$/, "sn": /\d/ },
        "action": function (data) {
            var table = getSheetData(data.sn)
            var index = binary_search(table, Number(data.sn))

            if (index > -1)
                return successResponse(formatData(table[index]))
            else
                return failResponse({})
        }
    },
    {
        "requirements": { "type": /^quiz$/, "question": /.+/ },
        "action": function (data) {
            let sheets = sheetDB.getSheets();
            for (let index in sheets) {
                var sheetValues = sheets[index].getDataRange().getDisplayValues()
                for (let valueIndex in sheetValues) {
                    if (sheetValues[valueIndex][1] == decodeURIComponent(data.question)) {
                        let response = sheetValues[valueIndex];
                        return successResponse(formatData(response))
                        break;
                    }
                }
            }

            return failResponse({})
        }
    },
    {
        "requirements": { "type": /^randomQuiz$/, "bsn": /\d/ },
        "action": function (data) {
            var response = []

            sheetDB.getSheets().forEach(function (sheet) {
                var sheetValues = sheet.getDataRange().getDisplayValues()
                response = response.concat(sheetValues.filter(function (value) {
                    return value[8] == data.bsn
                }))
            })

            if (response.length > 0)
                return successResponse(formatData(response[Math.floor(Math.random() * response.length)]))
            else
                return failResponse({})
        }
    },
    {
        "requirements": { "type": /^randomQuiz$/ },
        "action": function (data) {
            var response = getSheetData(Math.random() * 99999)

            if (response.length > 0)
                return successResponse(formatData(response[Math.floor(Math.random() * response.length)]))
            else
                return failResponse({})
        }
    },
    {
        "requirements": {},
        "action": function (data) {
            return "No Message"
        }
    }
]