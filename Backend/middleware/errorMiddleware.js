/**
 * Global Error Handling Middleware
 * Catches all errors and sends clean responses
 */

export const errorMiddleware = (err, req, res, next) => {
  // Default values
 const status = err.status || 500;
  const message = err.message || "Backend Server Error";
  const extra = err.extra || 'err details not provided';

  return res.status(status).json({
    message,
    extra
  });

  // 🔴 Mongoose Bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Resource not found";
  }

  // 🔴 Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered`;
  }

  // 🔴 Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Show stack trace only in development
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};


