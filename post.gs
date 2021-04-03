const CURRENT_VERSION = "5.0.0";

function test() {
  let data = {
    "version": "4.0",
    "sn": 26508,
    "question": "%E3%80%8C%E5%A2%83%E7%95%8C%E7%B7%9A%E4%B8%8A%E7%9A%84%E5%9C%B0%E5%B9%B3%E7%B7%9A%E3%80%8D%E4%B8%AD%EF%BC%8C%E8%87%AA%E5%8B%95%E4%BA%BA%E5%BD%A2F%EF%BC%8E%E6%B2%83%E7%88%BE%E8%BE%9B%E5%8E%84%E5%A7%86%E6%98%AF%E4%BB%A5%E4%BB%80%E9%BA%BC%E7%B3%BB%E7%B5%B1%E6%93%8D%E7%B8%B1%E8%BA%AB%E9%AB%94%E7%9A%84%EF%BC%9F",
    "options": ["%E4%BA%BA%E5%B7%A5%E8%82%8C%E8%82%89", "Wire%20Cylinder", "%E6%96%B9%E8%88%9F%E5%8F%8D%E6%87%89%E7%88%90", "%E9%87%8D%E5%8A%9B%E6%8E%A7%E5%88%B6"],
    "BoardSN": "60404",
    "reporter": "moontai0724",
    "author": "andy090517",
    "this_answered": 1,
    "correctness": true,
  };

  doPost({ postData: { contents: JSON.stringify(data) } });
}

function doPost(request) {
  let data = JSON.parse(request.postData.contents);

  let sourceQuiz;

  try {
    sourceQuiz = Quiz.from(data);
  } catch (error) {
    return ContentService.createTextOutput(new CustomResponse(false, "DATA_INVALID", error)).setMimeType(ContentService.MimeType.JSON);
  }

  if (data.version != CURRENT_VERSION)
    return ContentService.createTextOutput(new CustomResponse(false, "VERSION_OUTDATED")).setMimeType(ContentService.MimeType.JSON);

  let db = new Database(sourceQuiz.sn);
  let existingQuiz = db.find(sourceQuiz.sn);

  if (!existingQuiz) {
    let result = db.append(sourceQuiz);
    return ContentService.createTextOutput(new CustomResponse(true, "DATA_APPENDED", result)).setMimeType(ContentService.MimeType.JSON);
  }

  let updated = false;

  if (!existingQuiz.answer && sourceQuiz.answer) {
    existingQuiz.answer = sourceQuiz.answer;
    updated = true;
  }

  if (!existingQuiz.author) {
    existingQuiz.author = sourceQuiz.author;
    updated = true;
  }

  if (updated) {
    let index = db.sheet.getRange("A1:A").find(existingQuiz.sn).getRowIndex();
    let result = db.sheet.getRange(`${index}:${index}`).setValues([existingQuiz.toArray()]);
    return ContentService.createTextOutput(new CustomResponse(true, "DATA_UPDATED", existingQuiz)).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(new CustomResponse(true, "IGNORED", existingQuiz)).setMimeType(ContentService.MimeType.JSON);
}
