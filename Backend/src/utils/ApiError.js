class ApiError extends Error {
  constructor(message="something went wrong",
     statusCode,
     Errors = [],
     stack = "") 
  {
    super(message);
    this.statusCode = statusCode 
    this.data = null
    this.message = message
    this.success = false
    this.Errors = Errors
    
    if (stack) {
      this.stack = stack;
    }
    else {
      Error.captureStackTrace(this, this.constructor);
    }
  };
}

exports = {ApiError};