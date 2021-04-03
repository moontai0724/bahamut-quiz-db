/** @class */
class Quiz {
  /**
   * ID of quiz
   * @type {Number}
   */
  // sn;
  /**
   * Question of quiz 
   * @type {String}
   */
  // question;
  /**
   * Options of this quiz, total length 4.
   * @type {Array<String>}
   */
  // options;
  /**
   * Answer of this quiz, valid option: 1, 2, 3, 4.
   * @type {Number}
   */
  // answer;
  /**
   * Author's Bahamut account
   * @type {String}
   */
  // author;
  /**
   * ID of board
   * @type {Number}
   */
  // bsn;

  /**
   * @param {Array<String>|null} rowData raw data of row of quiz
   */
  constructor(rowData) {
    if (!rowData) return;
    this.sn = Number(rowData[0]);
    this.question = rowData[1];
    this.options = [rowData[2], rowData[3], rowData[4], rowData[5]];
    this.answer = Number(rowData[6]);
    this.author = rowData[7];
    this.bsn = Number(rowData[8]);
  }

  /**
   * Convert aand validate raw data from client
   * @param requestData data sent from client
   * @throws {Error} when data is not satisified fields which quiz need
   * @returns {Quiz}
   */
  static from(requestData) {
    let quiz = new Quiz();
    if (requestData.sn &&
      Number.isNaN(Number.parseInt(requestData.sn)) == false)
      quiz.sn = Number(requestData.sn);
    else throw new Error("INVALID_SN");

    if (requestData.question &&
      typeof requestData.question === "string" &&
      requestData.question != "")
      quiz.question = decodeURIComponent(requestData.question);
    else throw new Error("INVALID_QUESTION");

    if (
      requestData.options &&
      requestData.options instanceof Array &&
      requestData.options.length == 4 &&
      requestData.options.every(value => typeof value === "string" && value != ""))
      quiz.options = requestData.options.map(decodeURIComponent);
    else throw new Error("INVALID_OPTIONS");

    if (requestData.author &&
      typeof requestData.author === "string" &&
      requestData.author != "")
      quiz.author = requestData.author;
    else throw new Error("INVALID_AUTHOR");

    if (requestData.bsn &&
      Number.isNaN(Number.parseInt(requestData.bsn)) == false)
      quiz.bsn = Number(requestData.bsn);
    else throw new Error("INVALID_BSN");

    if (requestData.correctness &&
      requestData.this_answered &&
      [1, 2, 3, 4].includes(Number(requestData.this_answered)))
      quiz.answer = Number(requestData.this_answered);

    return quiz;
  }

  toString() {
    return JSON.stringify(this);
  }

  toArray() {
    return [this.sn, this.question, this.options[0], this.options[1], this.options[2], this.options[3], this.answer, this.author, this.bsn];
  }
}
