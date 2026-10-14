// ==
//  1. Purpose
//     The entry point for the whole app. This is the file Node
//     actually runs (npm start runs "node server.js"). It loads
//     environment variables, makes sure the JWT secret is set,
//     brings in the Express app from app.js, and starts listening
//     for requests on the chosen port.
//  2. Key Terms and Definitions
//     dotenv          - a small library that reads the .env file and
//                       puts the values onto process.env. We have to
//                       load this BEFORE anything that needs those
//                       values (like the JWT helper that reads
//                       JWT_SECRET).
//     process.env     - where Node keeps environment variables
//     app.listen      - tells Express to start the server on a port
//     fail fast       - stop right away at startup if something
//                       important is missing, instead of finding out
//                       later when a user tries to log in
//  3. Inputs
//     - JWT_SECRET from .env (required, at least 32 characters)
//     - PORT from .env (defaults to 8080 if not set)
//     - The Express app from app.js
//  4. Output
//     - A running server that takes HTTP requests, or an error
//       message and exit if JWT_SECRET is missing or too short
//  Plan
//  ==
//  1. Load .env right at the top
//  2. Check JWT_SECRET exists and is long enough, exit if not
//  3. Bring in the Express app
//  4. Read the port from .env (or fall back to 8080)
//  5. Call app.listen and log a message when it starts
//  ==

require('dotenv').config();

// A short or missing secret means tokens can be guessed or forged,
// so don't even start the server.
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  console.error('JWT_SECRET is missing or too short (needs 32+ characters).');
  console.error('Make one with: openssl rand -hex 32');
  process.exit(1);
}

const app = require('./src/app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
