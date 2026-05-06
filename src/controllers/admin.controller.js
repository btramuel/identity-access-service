// Purpose
//     The functions that run for the admin only routes. The /admin
//     route is a test that the user has the admin role. The
//     /admin/users route shows a real example of something only an
//     admin should be able to do: list every user in the system.
//
// Key Terms and Definitions
//     prisma.user.findMany - asks the database for all users at once
//     select               - tells Prisma which columns to send back.
//                            We leave out the password on purpose so
//                            it never gets sent to the client.
// Inputs
//     - req.user, the admin making the request
//  Output
//     - getAdminInfo:  200 with a "hello admin" message
//     - listAllUsers:  200 with an array of every user in the system

//  Plan
//  1. Bring in the prisma client
//  2. Write getAdminInfo: just send back a message and the admin's name
//  3. Write listAllUsers: query all users and send them back without
//     their passwords

const prisma = require('../prisma');

function getAdminInfo(req, res) {
  return res.status(200).json({
    message: 'Welcome to the admin area',
    admin: req.user.username,
  });
}

async function listAllUsers(req, res, next) {
  try {
    // We pick which fields to send back so the password never goes out
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        enabled: true,
        createdAt: true,
        roles: {
          select: { name: true },
        },
      },
    });

    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAdminInfo,
  listAllUsers,
};
