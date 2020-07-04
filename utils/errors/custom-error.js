class CustomError extends Error { 
  constructor(responseObject) {
    super(responseObject.message);
    this.responseObject = responseObject
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  response() {
    return this.responseObject;
  }
  
}

module.exports = { CustomError };
