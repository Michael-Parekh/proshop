// Custom error middleware for handling '404' errors.
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// Custom error middleware that overrides the default error handler.
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // If the error has a '200' status code, then make it a '500' server error.
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Get the error stack trace if it is in development mode. 
  });
}

export { notFound, errorHandler };