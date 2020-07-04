const { CustomError } = require("../errors/custom-error");
const { InternalServerErr } = require("../status-code");

class InternalServerError extends CustomError {
  constructor(responseObject) {
    super(responseObject.message);
    this.statusCode = InternalServerErr;
    this.responseObject = responseObject;
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

module.exports = { InternalServerError };
