const { CustomError } = require('./custom-error');
const { BadRequest } = require('../status-code');

class BadRequestError extends CustomError {
  constructor(responseObject) {
    super(responseObject.message);
    this.statusCode = BadRequest;
    this.responseObject = responseObject;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

module.exports = { BadRequestError };
