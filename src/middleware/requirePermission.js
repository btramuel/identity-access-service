// Purpose
//     Middleware that checks if the logged-in user has a certain
//     permission before letting them past. Roles are groups of
//     permissions, so this is a finer check than requireRole. For
//     example, /admin/users needs ADMIN_READ. This is used after
//     requireAuth, so we already know req.user is set.
//
// Key Terms and Definitions
//     permission       - one specific thing a user is allowed to do,
//                        like USER_READ or ADMIN_READ. Roles hold
//                        permissions (see prisma/seed.js).
//     factory function - a function that makes another function. Same
//                        idea as requireRole: requirePermission('ADMIN_READ')
//                        gives back a middleware that checks that one
//                        permission.
//     403 Forbidden    - the user IS logged in but isn't allowed to do this
//
// Inputs
//     - permissionName: the permission to check for, like 'ADMIN_READ'
//     - req.user.permissions: set by requireAuth
//
// Output
//     - If the user has the permission: next() is called
//     - If they don't: 403 Forbidden response
//
//  Plan
//  1. Take in a permission name like 'ADMIN_READ'
//  2. Return a middleware function that:
//       - reads req.user.permissions
//       - calls next() if the permission is in there, or sends 403 if it isn't

function requirePermission(permissionName) {
  return function (req, res, next) {
    // requireAuth should have run before this, so req.user should exist
    if (!req.user) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    if (!req.user.permissions.includes(permissionName)) {
      return res.status(403).json({ error: `${permissionName} permission required` });
    }

    next();
  };
}

module.exports = requirePermission;
