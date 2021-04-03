/** @class */
class Database {
  /**
   * @type {SpreadsheetApp.Spreadsheet}
   */
  // spreadsheet;
  /**
   * @type {SpreadsheetApp.Sheet|undefined}
   */
  // sheet;

  /**
   * @param {Number|null} quizSN sn of quiz, if provided, will load corresponding sheet
   */
  constructor(quizSN) {
    this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (quizSN)
      this.loadSheet(quizSN);
  }

  /**
   * Load corresponding sheet for specific quiz
   * @param {Number} quizSN quiz sn to load corresponding sheet
   */
  loadSheet(quizSN) {
    let sheetName = Math.floor(Number(quizSN) / 5000) * 5 + 'k';
    if (this.sheet && this.sheet.getName() == sheetName)
      return this.sheet;

    this.sheet = this.spreadsheet.getSheetByName(sheetName);
    return this.sheet;
  }

  /**
   * Find a quiz in database by sn
   * @param {Number} quizSN SN of quiz
   * @returns {Quiz|null} found quiz or null instead
   */
  find(quizSN) {
    this.loadSheet(quizSN);
    let matchCell = this.sheet.getRange("A:A").createTextFinder(quizSN).matchEntireCell(true).findNext();
    if (!matchCell) return null;

    let rowIndex = matchCell.getRowIndex();
    let row = this.sheet.getRange(`${rowIndex}:${rowIndex}`);
    return new Quiz(row.getDisplayValues()[0]);
  }

  /**
   * Find a quiz in database by question
   * @param {Number} question question of quiz
   * @returns {Quiz|null} found quiz or null instead
   */
  findByQuestion(question) {
    let matchCell = this.spreadsheet.createTextFinder(question).matchEntireCell(true).findNext();
    if (!matchCell) return null;

    let rowIndex = matchCell.getRowIndex();
    let row = matchCell.getSheet().getRange(`${rowIndex}:${rowIndex}`);
    return new Quiz(row.getDisplayValues()[0]);
  }

  /**
   * Get a random quiz in all data
   */
  getRandom() {
    let randomSN = Math.floor(Math.random() * 120000);
    this.loadSheet(randomSN);

    let amount = this.sheet.getMaxRows() - 1;
    if (amount == 1)
      return this.getRandom();

    let randomIndex = Math.floor(Math.random() * amount);
    let quiz = this.sheet.getRange(`${randomIndex}:${randomIndex}`);

    return new Quiz(quiz.getDisplayValues()[0]);
  }

  /**
   * Get a random quiz in specified board
   * @param {Number} bsn board sn
   */
  getRandomInBoard(bsn) {
    let matchCells = this.spreadsheet.createTextFinder(Number(bsn)).matchEntireCell(true).findAll();

    if (matchCells.length == 0)
      return null

    let randomIndex = Math.floor(Math.random() * matchCells.length);
    let index = matchCells[randomIndex].getRowIndex();
    let quiz = matchCells[randomIndex].getSheet().getRange(`${index}:${index}`);

    return new Quiz(quiz.getDisplayValues()[0]);
  }

  /**
   * Append data to sheet
   * @param {Quiz} quiz 
   */
  append(quiz) {
    let result = this.sheet.appendRow(quiz.toArray());
    this.sheet.sort(1);
    return result;
  }
}
