// utils/CustomError.js
class CustomError extends Error {
    constructor(statusCode, success, errorMsg) {
        super(errorMsg);
        this.statusCode = statusCode;
        this.success = success;
        this.errorMsg = errorMsg;

        // Capture the stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;
