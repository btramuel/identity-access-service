// Purpose
//     A small error type for errors we throw on purpose, like
//     "Invalid credentials". It carries the HTTP status code with it,
//     so the error handler knows what to send back without having to
//     match on the exact message text.
//
// Key Terms and Definitions
//     extends Error - makes AppError a normal error that also has a
//                     status field
//     status        - the HTTP status code to send back (401, 409, etc.)
//
// Inputs
//     - message: what went wrong, shown to the user
//     - status:  the HTTP status code
//
// Output
//     - An error object with .message and .status
//
//  Plan
//  1. Make a class that extends Error
//  2. Save the status on it
//  3. Export it

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = AppError;
