// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const success = err.success === undefined ? false : err.success;
    const errorMsg = err.errorMsg || "Internal Server Error";

    console.error("Error:", err);

    res.status(statusCode).json({
        success,
        message: errorMsg,
    });
};

export default errorHandler;
