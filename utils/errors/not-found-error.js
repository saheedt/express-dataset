const { CustomError } = require('../errors/custom-error');
const { NotFound } = require('../status-code');

class NotFoundError extends CustomError {
  constructor(responseObject) {
    super(responseObject, NotFound);
    this.responseObject = responseObject;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

module.exports = { NotFoundError };
