// Purpose
//     The functions that actually run when someone hits /auth/register
//     or /auth/login. The controller's job is to read the request,
//     check the input is valid, hand it off to the service, and send
//     back a response
//
// Key Terms and Definitions
//     controller   - the function tied to a route. It's the bridge
//                    between the HTTP request and the service layer.
//     req.body     - the JSON the client sent in the request body
//     next(err)    - hands the error to the error handler middleware
//                    instead of crashing or doing it inline
//     async/await  - lets us write code that waits for things (like
//                    database calls) without using a bunch of nested
//                    callbacks
// Inputs
//     - register: req.body = { username, email, password }
//     - login:    req.body = { username, password }
//
// Output
//     - register: 201 with the new user info
//     - login:    200 with { token, username }
//
//  Plan
//  1. Bring in the auth service and the validators
//  2. Write registerHandler:
//       - run the body through registerSchema.parse
//       - call authService.register
//       - send 201 with the new user
//  3. Write loginHandler the same way using loginSchema
//  4. Export the handlers
//
//  Note: there used to be a /auth/bootstrap-admin handler here. It was
//  removed because anyone could call it. The first admin now comes from
//  "npm run seed" using ADMIN_* values in .env.

const authService = require('../services/auth.service');
const {
  registerSchema,
  loginSchema,
} = require('../validators/auth.validators');

async function registerHandler(req, res, next) {
  try {
    // parse() will throw a ZodError if the body is missing fields
    // or has the wrong types. The error handler turns that into a 400.
    const data = registerSchema.parse(req.body);

    const newUser = await authService.register(data);

    return res.status(201).json({
      message: 'User registered',
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
}

async function loginHandler(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(data);

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerHandler,
  loginHandler,
};
