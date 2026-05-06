// Purpose
//     Middleware that checks if the logged-in user has a certain role
//     before letting them past. For example, the /admin route should
//     only work for users with ROLE_ADMIN. This is used after
//     requireAuth, so we already know req.user is set.
//
// Key Terms and Definitions
//     factory function - a function that makes another function. We
//                        use one here so we can write requireRole('ADMIN')
//                        in the route file and get back a middleware
//                        that checks for that one role.
//     403 Forbidden    - the right status code when the user IS logged
//                        in but doesn't have permission. (401 is for
//                        when they aren't logged in at all.)
//
// Inputs
//     - roleName: the name of the role to check for, like 'ADMIN'
//                 (we add 'ROLE_' to the front, so 'ADMIN' becomes 'ROLE_ADMIN')
//     - req.user: set by requireAuth
//
// Output
//     - If the user has the role: next() is called
//     - If they don't: 403 Forbidden response
//
//  Plan
//  1. Take in a role name like 'ADMIN'
//  2. Return a middleware function that:
//       - reads req.user.roles
//       - checks if 'ROLE_ADMIN' (or whatever) is in there
//       - calls next() if it is, or sends 403 if it isn't

function requireRole(roleName) {
  // Tack on "ROLE_" since that's how the roles are named in the database
  const fullRoleName = `ROLE_${roleName}`;

  return function (req, res, next) {
    // requireAuth should have run before this, so req.user should exist
    if (!req.user) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    if (!req.user.roles.includes(fullRoleName)) {
      return res.status(403).json({ error: `${fullRoleName} required` });
    }

    next();
  };
}

module.exports = requireRole;
