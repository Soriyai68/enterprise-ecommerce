/**
 * Wrapper for async route handlers to catch errors
 * Usage: asyncHandler(async (req, res, next) => { ... })
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
