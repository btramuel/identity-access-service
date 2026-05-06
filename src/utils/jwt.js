// Purpose
//     Helper functions for working with JWT tokens. A JWT is a
//     signed string the server gives the user after they log in.
//     The user sends it back on every request so the server knows
//     who they are without making them log in every time.
//   
// Key Terms and Definitions
//     JWT - JSON Web Token. A string that holds info about the
//     user (like their username) and is signed with a secret key so it can't be faked.
//
//     payload - the data we put inside the token (here, the username)
//
//     sign - turn the payload into a signed token string
//
//     verify - check that a token is real and hasn't expired,
//     then give back the payload inside it
//
//     secret - a long random string only the server knows, used
//     to sign and check tokens. It comes from .env.
// Inputs
//     - JWT_SECRET from .env  (used to sign and check tokens)
//     - JWT_EXPIRES_IN from .env  (how long the token lasts, in seconds)
//     - A username when making a token
//     - A token string when checking one
//
// Output
//     - generateToken: a new signed token string
//     - verifyToken:   the payload inside the token, or throws an
//                      error if the token is bad or expired
//
//  Plan
//  1. Bring in jsonwebtoken and read the secret from .env
//  2. Write generateToken(username) that signs a new token
//  3. Write verifyToken(token) that checks a token and gives back
//     the username, or throws an error
//  4. Export both functions so other files can use them

const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '3600', 10);

function generateToken(username) {
  // The first argument is the payload (what we put inside the token)
  // The second is the secret used to sign it
  // expiresIn is how long until the token stops working
  return jwt.sign({ sub: username }, SECRET, { expiresIn: EXPIRES_IN });
}

function verifyToken(token) {
  // jwt.verify will throw an error if the token is bad or expired,
  // which we catch in the middleware
  return jwt.verify(token, SECRET);
}

module.exports = {
  generateToken,
  verifyToken,
};
