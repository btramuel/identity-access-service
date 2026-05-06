// Purpose
//     Sets up the Express app: brings in all the routes, the JSON
//     body parser, CORS, and the error handler. This file builds
//     the app but doesn't actually start the server (that happens
//     in server.js). Splitting them up makes it easier to test.
//
// Key Terms and Definitions
//     express.json()- middleware that reads the JSON body of
//     incoming requests and turns it into a real JavaScript object on req.body
//
//     CORS- "Cross-Origin Resource Sharing". Lets a
//     front-end on a different domain (like localhost:3000) talk to this API. 
//     Without it, the browser would block those requests.
//
//     mount path - the URL prefix a router gets. For example,
//     app.use('/auth', authRoutes) means a route defined as POST /register inside authRoutes
//     actually responds to POST /auth/register
//
//     "404 not found" - the response we send when no route matches.
//       We add this at the very end so anything that wasn't caught above gets a clean error.
//
//  Inputs
//     - Incoming HTTP requests
//
//  Output
//     - The configured Express app, ready to be started by server.js
//
//  Plan
//  1. Make a new Express app
//  2. Plug in CORS and the JSON body parser
//  3. Add a basic GET / route that says the API is alive
//  4. Mount /auth, /users, /admin
//  5. Add a 404 handler for any URL that doesn't match
//  6. Add the error handler last (it has to go last in Express)
//  7. Export the app

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Let other domains call our API
app.use(cors());

// Read JSON request bodies
app.use(express.json());

// A simple "is the server up?" check
app.get('/', (req, res) => {
  res.json({ message: 'Identity Access Service is running' });
});

// Wire up the route groups
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/admin', adminRoutes);

// Anything that didn't match a route above gets a 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// The error handler has to be the last thing we add
app.use(errorHandler);

module.exports = app;
