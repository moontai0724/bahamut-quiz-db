/** @class */
class CustomResponse {
  /**
   * Is this response success or not?
   * @type {Boolean}
   */
  // success;
  /**
   * Message to describe this response.
   * @type {String}
   */
  // message;
  /**
   * Data attached to this response.
   * @type {JSON}
   */
  // data;

  /**
   * @param {Boolean} success Is this response success or not?
   * @param {String} message Message to describe this response.
   * @param {any} data Data attached to this response.
   */
  constructor(success, message, data) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  toString() {
    return JSON.stringify(this);
  }
}
