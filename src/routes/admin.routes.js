// Purpose
//     Routes for /admin. Both routes need the user to be logged in
//     (requireAuth). GET /admin checks for the ADMIN role, and
//     GET /admin/users checks for the ADMIN_READ permission. If any
//     check fails, the controller never runs.
//
// Key Terms and Definitions
//  stacked middleware - listing more than one middleware on a route.
//  They run one after the other and any of them can stop the request.
//
//  role vs permission - a role is a group (ROLE_ADMIN), a permission is
//  one specific action (ADMIN_READ). Checking the permission means a new
//  role could get access to /admin/users later just by being given
//  ADMIN_READ, without touching this file.
//
// Inputs
//     - HTTP requests starting with /admin
//     - Authorization: Bearer <token> header (must belong to an admin)
//
// Output
//     - GET /admin- 200 with an admin welcome message
//     - GET /admin/users - 200 with the full list of users
//     - 401 if not logged in, 403 if logged in but missing the role or permission
//
//  Plan
//  1. Make a new Router
//  2. Set up GET / -> requireAuth -> requireRole('ADMIN') -> getAdminInfo
//  3. Set up GET /users -> requireAuth -> requirePermission('ADMIN_READ') -> listAllUsers
//  4. Export it

const express = require('express');

const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const requirePermission = require('../middleware/requirePermission');
const {
  getAdminInfo,
  listAllUsers,
} = require('../controllers/admin.controller');

const router = express.Router();

router.get('/', requireAuth, requireRole('ADMIN'), getAdminInfo);
router.get('/users', requireAuth, requirePermission('ADMIN_READ'), listAllUsers);

module.exports = router;
