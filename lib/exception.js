"use strict";

// Custom error exception class
class ExceptionError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppErrorException";
    }
}

module.exports = (message, errorCode, statusCode) => {
    const error = new ExceptionError(message, statusCode);
    error.code = errorCode;
    return error;
}

