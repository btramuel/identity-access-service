// Purpose
//     Lists the URLs that start with /auth and connects each one to
//     the right controller function. Routes don't do any work
//     themselves; they just point each URL at the function that
//     should handle it. We also put rate limiting on /auth/login
//     so people can't try a million passwords in a row.
//
// Key Terms and Definitions
//     express.Router - lets us group related routes together
//     in their own file instead of putting everything in app.js
//
//     express-rate-limit - a small middleware that blocks people
//      who send too many requests in a short time. Good for stopping login bots.
//
//     windowMs - how long the rate limit window is
//
//     max - how many requests are allowed in that window
//
// Inputs
//     - HTTP requests starting with /auth
//
//  Output
//     - Each request gets sent to the matching controller function
//
//  Plan
//  1. Make a new Router
//  2. Set up a rate limiter for the login route (5 tries per 15 min)
//  3. Wire up POST /register, POST /login, POST /bootstrap-admin
//  4. Export the router so app.js can plug it in

const express = require('express');
const rateLimit = require('express-rate-limit');

const {
  registerHandler,
  loginHandler,
  bootstrapAdminHandler,
} = require('../controllers/auth.controller');

const router = express.Router();

// Block someone after 5 failed login tries in 15 minutes. This stops
// people from guessing passwords over and over.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerHandler);
router.post('/login', loginLimiter, loginHandler);
router.post('/bootstrap-admin', bootstrapAdminHandler);

module.exports = router;
