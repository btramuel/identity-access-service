// Purpose
//     Holds the main logic for registering and logging in users.
//     The controller calls these functions and then sends a response
//     back to the user. Keeping this logic out of the controller
//     makes the code cleaner and easier to test.
//
// Key Terms and Definitions
//     bcrypt - a library that scrambles passwords before
//     we save them. We never store real passwords in the database, only the scrambled version.
//
//     hash - the scrambled version of a password. It can
//     only go one way, so even if someone steals the database they can't get the real passwords.
//
//     compare - check if a plain password matches a hash that's already in the database
//
//     salt rounds - how many times bcrypt scrambles the password.  Higher is safer but slower. 10 is a normal value.
//
//     dummy hash - a fake hash we compare against when the username
//     doesn't exist. bcrypt is slow on purpose, so if we skipped it for
//     unknown usernames, those requests would come back faster and an
//     attacker could time the responses to find real usernames.
//
//     AppError - our error type that carries an HTTP status (see utils/AppError.js)
//
// Inputs
//     - register: { username, email, password }
//     - login:    { username, password }
//
// Output
//     - register: the new user (without the password)
//     - login:    a JWT token if the password matches
//     - throws an AppError if something is wrong (like a duplicate email
//       or a bad password)
//
//  Plan
//  1. Bring in bcrypt, the prisma client, the JWT helper, and AppError
//  2. Write register():
//       - check if the username or email is already taken (409)
//       - find the ROLE_USER row
//       - hash the password
//       - create the new user and link them to ROLE_USER
//  3. Write login():
//       - find the user by username
//       - ALWAYS run a bcrypt compare (against a dummy hash if the user
//         doesn't exist) so every failed login takes the same time
//       - if the user doesn't exist or the password is wrong, throw 401
//       - only AFTER the password checks out, check if they're disabled (403)
//       - make a token and return it
//  4. Export the functions
//
//  Note: the first admin is made by prisma/seed.js, not by an endpoint.

const bcrypt = require('bcrypt');
const prisma = require('../prisma');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

const SALT_ROUNDS = 10;

// Made once when the server starts. It's the hash of a random string
// nobody knows, so nothing will ever match it.
const DUMMY_HASH = bcrypt.hashSync(`no-such-user-${Date.now()}-${Math.random()}`, SALT_ROUNDS);

async function register({ username, email, password }) {
  // Make sure no one else has this username or email
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existing) {
    if (existing.username === username) {
      throw new AppError('Username already taken', 409);
    } else {
      throw new AppError('Email already in use', 409);
    }
  }

  // Find the ROLE_USER row so we can attach it
  const userRole = await prisma.role.findUnique({
    where: { name: 'ROLE_USER' },
  });

  if (!userRole) {
    // This shouldn't happen if the seed script was run. Plain Error on
    // purpose so it shows up as a 500 and gets logged.
    throw new Error('ROLE_USER does not exist. Did you run the seed script?');
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Make the new user and link them to the user role
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      roles: {
        connect: [{ id: userRole.id }],
      },
    },
    include: {
      roles: true,
    },
  });

  // Don't send the password hash back to the user
  const { password: _, ...safeUser } = newUser;
  return safeUser;
}

async function login({ username, password }) {
  // Look up the user and grab their roles at the same time
  const user = await prisma.user.findUnique({
    where: { username },
    include: { roles: true },
  });

  // Always run bcrypt, even when the user doesn't exist, so a wrong
  // username takes just as long as a wrong password
  const hashToCheck = user ? user.password : DUMMY_HASH;
  const passwordMatches = await bcrypt.compare(password, hashToCheck);

  // Same message for both cases so attackers can't tell which usernames exist
  if (!user || !passwordMatches) {
    throw new AppError('Invalid credentials', 401);
  }

  // Only check this after the password is right. Otherwise anyone could
  // find out an account is disabled without knowing the password.
  if (!user.enabled) {
    throw new AppError('Account is disabled', 403);
  }

  // Make a token and send it back
  const token = generateToken(user.id);
  return { token, username: user.username };
}

module.exports = {
  register,
  login,
};
