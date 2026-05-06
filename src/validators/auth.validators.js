// Purpose
//     Checks that the data the user sends to /auth/register and
//     /auth/login looks right before we do anything with it. For
//     example, if someone sends a register request without a
//     password, we want to stop right there and send back a clear
//     error message instead of crashing later.
//
// Key Terms and Definitions
//     zod - a small library that lets us describe what valid
//     input looks like, then check incoming data against that description
//
//     schema - the description of what valid input looks like
//     (for example: "username must be a string with at least 3 characters")
//
//     parse - run the data through the schema. If it doesn't
//     match, zod throws an error.
//
// Inputs
//     - The request body from the user (usually req.body)
//
// Output
//     - registerSchema: rules for /auth/register
//     - loginSchema:    rules for /auth/login
//
//  Plan
//  1. Bring in zod
//  2. Make a schema for register (username, email, password)
//  3. Make a schema for login (username, password)
//  4. Export both schemas

const { z } = require('zod');

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Email must be a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
};
