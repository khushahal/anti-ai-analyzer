/**
 * Async Handler - Wraps async route handlers to catch errors
 * This prevents having to write try-catch blocks in every route
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
