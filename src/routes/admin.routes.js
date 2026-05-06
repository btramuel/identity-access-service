// Purpose
//     Routes for /admin. Both routes are locked behind two
//     middlewares: requireAuth (must be logged in) and
//     requireRole('ADMIN') (must have ROLE_ADMIN). If either check
//     fails, the controller never runs.
//
// Key Terms and Definitions
//  stacked middleware - listing more than one middleware on a route.
//  They run one after the other and any of them can stop the request.
//
// Inputs
//     - HTTP requests starting with /admin
//     - Authorization: Bearer <token> header (must belong to an admin)
//
// Output
//     - GET /admin- 200 with an admin welcome message
//     - GET /admin/users - 200 with the full list of users
//     - 401 if not logged in, 403 if logged in but not an admin
//
//  Plan
//  1. Make a new Router
//  2. Set up GET / -> requireAuth -> requireRole('ADMIN') -> getAdminInfo
//  3. Set up GET /users -> same middleware -> listAllUsers
//  4. Export it

const express = require('express');

const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const {
  getAdminInfo,
  listAllUsers,
} = require('../controllers/admin.controller');

const router = express.Router();

router.get('/', requireAuth, requireRole('ADMIN'), getAdminInfo);
router.get('/users', requireAuth, requireRole('ADMIN'), listAllUsers);

module.exports = router;
