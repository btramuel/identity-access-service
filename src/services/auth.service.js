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
// Inputs
//     - register: { username, email, password }
//     - login:    { username, password }
//     - registerAdmin: { username, email, password } (only used once
//                       to make the first admin)
//
// Output
//     - register: the new user (without the password)
//     - login:    a JWT token if the password matches
//     - throws errors if something is wrong (like a duplicate email
//       or a bad password)
//
//  Plan
//  1. Bring in bcrypt, the prisma client, and the JWT helpers
//  2. Write register():
//       - check if the username or email is already taken
//       - find the ROLE_USER row
//       - hash the password
//       - create the new user and link them to ROLE_USER
//  3. Write login():
//       - find the user by username
//       - if they don't exist, throw an error
//       - compare the given password to the hashed one
//       - if it matches, make a token and return it
//  4. Write registerAdmin() the same as register but with ROLE_ADMIN
//  5. Export the functions

const bcrypt = require('bcrypt');
const prisma = require('../prisma');
const { generateToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

async function register({ username, email, password }) {
  // Make sure no one else has this username or email
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existing) {
    if (existing.username === username) {
      throw new Error('Username already taken');
    } else {
      throw new Error('Email already in use');
    }
  }

  // Find the ROLE_USER row so we can attach it
  const userRole = await prisma.role.findUnique({
    where: { name: 'ROLE_USER' },
  });

  if (!userRole) {
    // This shouldn't happen if the seed script was run
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

  if (!user) {
    // We say "Invalid credentials" instead of "user not found"
    // so attackers can't tell which usernames exist
    throw new Error('Invalid credentials');
  }

  if (!user.enabled) {
    throw new Error('Account is disabled');
  }

  // Check if the password they typed matches the hashed one we saved
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error('Invalid credentials');
  }

  // Make a token and send it back
  const token = generateToken(user.username);
  return { token, username: user.username };
}

async function registerAdmin({ username, email, password }) {
  // Same idea as register() but uses ROLE_ADMIN instead
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existing) {
    throw new Error('Username or email already in use');
  }

  const adminRole = await prisma.role.findUnique({
    where: { name: 'ROLE_ADMIN' },
  });

  if (!adminRole) {
    throw new Error('ROLE_ADMIN does not exist. Did you run the seed script?');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newAdmin = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
    include: { roles: true },
  });

  const { password: _, ...safeUser } = newAdmin;
  return safeUser;
}

module.exports = {
  register,
  login,
  registerAdmin,
};
