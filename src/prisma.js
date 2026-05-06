// Purpose
//     Makes one shared Prisma client that the rest of the app can
//     import. We only want one client for the whole app because
//     each client opens its own database connections, and making
//     a new one every time would waste connections.
//
// Key Terms and Definitions
//     PrismaClient - the object we use to run database queries
//      (like prisma.user.findMany() or prisma.user.create())
//
//     module.exports - how Node.js shares this client with other files
//
// Inputs
//     - DATABASE_URL from the .env file (Prisma reads this on its own)
//
// Output
//     - One Prisma client that any other file can import and use
//
//  Plan
//  1. Bring in PrismaClient from the @prisma/client package
//  2. Make one new client
//  3. Export it so other files can use it

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
