// Purpose
//     Middleware that runs before any route that needs the user to
//     be logged in. It looks at the Authorization header, checks
//     the JWT token, finds the user in the database, and sticks
//     them on the request object so the route can use them. If
//     anything is wrong (missing token, bad token, expired token),
//     it sends back a 401 error and stops there.
//
// Key Terms and Definitions
//     middleware       - a function that runs before the actual route.
//                        It can stop the request (by sending a response)
//                        or let it through by calling next().
//     Authorization    - an HTTP header where clients send their token.
//                        It looks like: Authorization: Bearer <token>
//     Bearer token     - just a name for "the person holding this token
//                        is allowed to do this". The word "Bearer" is
//                        always at the start of the header.
//     req.user         - we attach the logged-in user to this so the
//                        route can read who's making the request
//
// Inputs
//     - The Authorization header on the incoming request
//
// Output
//     - If the token is good: req.user gets set and next() is called
//     - If the token is bad:  401 Unauthorized response, request stops
//
//  Plan
//  1. Read the Authorization header
//  2. If it's missing or doesn't start with "Bearer ", send 401
//  3. Pull the actual token off the end (skip the "Bearer " part)
//  4. Try to verify the token. If it fails, send 401.
//  5. Take the username out of the token and look up the user in the
//     database (along with their roles)
//  6. If the user doesn't exist anymore, send 401
//  7. Attach the user to req.user and call next()

const prisma = require('../prisma');
const { verifyToken } = require('../utils/jwt');

async function requireAuth(req, res, next) {
  const header = req.headers['authorization'];

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  // Pull the token off the end of the header (skip the "Bearer " part)
  const token = header.substring(7);

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // The username was put in the "sub" field when the token was made
  const username = payload.sub;

  // Look up the user so we have the latest info (in case their roles changed)
  const user = await prisma.user.findUnique({
    where: { username },
    include: { roles: true },
  });

  if (!user || !user.enabled) {
    return res.status(401).json({ error: 'User not found or disabled' });
  }

  // Stick the user on the request so the route can use them
  // We leave off the password so it doesn't get used by mistake
  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles.map((r) => r.name),
  };

  next();
}

module.exports = requireAuth;
