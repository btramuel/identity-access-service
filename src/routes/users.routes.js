// Purpose
//     Routes for /users. There's only one for now: GET /users, which
//     any logged-in user can hit to see their own info. The route
//     is protected by requireAuth, so you have to send a valid
//     token to reach it.
//
// Key Terms and Definitions
//     middleware chain - middlewares run in the order they're listed.
//     Here, requireAuth runs first; if the token is good, getMyInfo runs next.
// Inputs
//     - HTTP requests starting with /users
//     - Authorization: Bearer <token> header
//
// Output
//     - 200 with the user's info, or 401 if not logged in
//
//  Plan
//  1. Make a new Router
//  2. Set up GET / -> requireAuth -> getMyInfo
//  3. Export it

const express = require('express');

const requireAuth = require('../middleware/requireAuth');
const { getMyInfo } = require('../controllers/users.controller');

const router = express.Router();

router.get('/', requireAuth, getMyInfo);

module.exports = router;
