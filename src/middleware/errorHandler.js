// Purpose
//     A catch-all middleware that runs at the end if anything threw
//     an error. Without this, Express would send back a big ugly
//     stack trace, and we'd have to write try/catch in every route.
//     Putting it in one place keeps the route files clean.
//
// Key Terms and Definitions
// error middleware - a special kind of middleware with FOUR
// arguments (err, req, res, next). Express knows it's an error handler because of the
// four arguments, and only sends errors here.
//
// ZodError - the error type zod throws when input doesn't  match the schema. We catch this on its own
// so we can send back a clean list of what's wrong instead of a generic 500.
//
// Inputs
//     - err: the error that was thrown somewhere upstream
//     - req, res: the usual request and response
//
// Output
//     - 400 if it was a zod validation error (with the field errors)
//     - 400 if it was a known business error (like duplicate email)
//     - 500 for anything else (something we didn't expect)
//
//  Plan
//  1. Check if it's a zod error -> send 400 with the issues
//  2. Check the error message for known cases -> send 400
//  3. Otherwise log it and send a generic 500

const { ZodError } = require('zod');

function errorHandler(err, req, res, next) {
  // Case 1: zod said the input was bad
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Invalid input',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Case 2: known business errors we threw on purpose
  const knownMessages = [
    'Username already taken',
    'Email already in use',
    'Username or email already in use',
    'Invalid credentials',
    'Account is disabled',
  ];

  if (knownMessages.includes(err.message)) {
    return res.status(400).json({ error: err.message });
  }

  // Case 3: something we didn't plan for. Log it and send a generic 500.
  console.error('Unexpected error:', err);
  return res.status(500).json({ error: 'Something went wrong on our end' });
}

module.exports = errorHandler;
