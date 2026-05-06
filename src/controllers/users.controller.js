// Purpose
//     The function that runs when someone hits GET /users. It's a
//     simple example of an endpoint that any logged-in user can
//     reach. It just sends back the info about the user who's
//     making the request.
//
// Key Terms and Definitions
//     req.user  - the logged-in user. requireAuth puts this on the
//                 request before this function runs.
// Inputs
//     - req.user (set by the requireAuth middleware)
//
// Output
//     - 200 with the user's info
//
//  Plan
//  1. Read req.user (set by the auth middleware)
//  2. Send back the basics: id, username, email, roles
//  

function getMyInfo(req, res) {
  return res.status(200).json({
    message: 'You are logged in',
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      roles: req.user.roles,
    },
  });
}

module.exports = {
  getMyInfo,
};
