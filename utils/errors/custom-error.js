class CustomError extends Error { 
  constructor(responseObject, statusCode) {
    super(responseObject.message);
    this.statusCode = statusCode;
    this.responseObject = responseObject
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  get response() {
    this.responseObject.status_code =
      this.statusCode;
    return this.responseObject;
  }
  
}

module.exports = { CustomError };
