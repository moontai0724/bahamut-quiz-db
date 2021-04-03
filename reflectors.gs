const REFLECTORS = [
  {
    "requirements": { "type": /^checkExisting$/, "sn": /\d/ },
    "action": function (data) {
      let sn = Number(data.sn);
      let db = new Database(sn);

      let quiz = db.find(sn);

      let found = quiz && quiz.answer;
      if (!found)
        return new CustomResponse(false, "NOT_FOUND");

      return new CustomResponse(true, "SUCCESS");
    }
  },
  {
    "requirements": { "type": /^answer$/, "sn": /\d/ },
    "action": function (data) {
      let sn = Number(data.sn);
      let db = new Database(sn);

      let quiz = db.find(sn);

      let found = quiz && quiz.answer;
      if (!found)
        return new CustomResponse(false, "NOT_FOUND");

      return new CustomResponse(true, "SUCCESS", quiz.answer);
    }
  },
  {
    "requirements": { "type": /^hint$/, "sn": /\d/ },
    "action": function (data) {
      let sn = Number(data.sn);
      let db = new Database(sn);

      let quiz = db.find(sn);

      let found = quiz && quiz.answer;
      if (!found)
        return new CustomResponse(false, "NOT_FOUND");

      let wrongAnswers = [1, 2, 3, 4].filter(value => value != quiz.answer);
      return new CustomResponse(true, "SUCCESS", wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)]);
    }
  },
  {
    "requirements": { "type": /^amounts$/ },
    "action": function (data) {
      let db = new Database();
      let sheets = db.spreadsheet.getSheets();

      let amounts = { total: 0 };

      sheets.forEach(sheet => {
        let name = sheet.getName();
        let amount = sheet.getMaxRows() - 1;
        if (amount === 1) amount = 0;
        amounts[name] = amount;
        amounts.total += amount;
      });

      return new CustomResponse(true, "SUCCESS", amounts);
    }
  },
  {
    "requirements": { "type": /^fullSpreadsheet$/ },
    "action": function (data) {
      let db = new Database();
      let sheets = db.spreadsheet.getSheets();
      let quizs = [];

      sheets.forEach(sheet => {
        let sheetQuizs = sheet.getRange("A2:I").getDisplayValues().map(values => new Quiz(values));
        quizs.concat(sheetQuizs);
      });

      return new CustomResponse(true, "SUCCESS", quizs);
    }
  },
  {
    "requirements": { "type": /^sheet$/, "sn": /\d/ },
    "action": function (data) {
      let sn = Number(data.sn);
      let db = new Database(sn);
      let sheetQuizs = db.sheet.getRange("A2:I").getDisplayValues().map(values => new Quiz(values));

      return new CustomResponse(true, "SUCCESS", sheetQuizs);
    }
  },
  {
    "requirements": { "type": /^quiz$/, "sn": /\d/ },
    "action": function (data) {
      let sn = Number(data.sn);
      let db = new Database(sn);

      let quiz = db.find(sn);

      let found = quiz && quiz.answer;
      if (!found)
        return new CustomResponse(false, "NOT_FOUND");

      return new CustomResponse(true, "SUCCESS", quiz);
    }
  },
  {
    "requirements": { "type": /^quiz$/, "question": /.+/ },
    "action": function (data) {
      let db = new Database();
      let question = decodeURIComponent(data.question);
      let quiz = db.findByQuestion(question);

      if (!quiz)
        return new CustomResponse(false, "NOT_FOUND");

      return new CustomResponse(true, "SUCCESS", quiz);
    }
  },
  {
    "requirements": { "type": /^randomQuiz$/, "bsn": /\d/ },
    "action": function (data) {
      let db = new Database();
      let quiz = db.getRandomInBoard(Number(data.bsn));

      return new CustomResponse(true, "SUCCESS", quiz);
    }
  },
  {
    "requirements": { "type": /^randomQuiz$/ },
    "action": function (data) {
      let db = new Database();
      let quiz = db.getRandom();

      return new CustomResponse(true, "SUCCESS", quiz);
    }
  },
  {
    "requirements": {},
    "action": function (data) {
      return new CustomResponse(true, "SUCCESS");
    }
  }
]
